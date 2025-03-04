import sendEmailNotification from "~/server/utils/email-service";
import { generateUniqueTicketNumbers } from "~/server/utils/ticketNumberGenerator";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status, userName, email } = body;

    if (!id || !status || !userName) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    const paymentRef = firebaseDb.collection("payments").doc(id);
    await paymentRef.update({ status, updatedAt: new Date() });

    if (status.toLowerCase() === "approved") {
      const ticketNumbers = await generateUniqueTicketNumbers(userName, 1);

      const ticketCollection = firebaseDb.collection("tickets");
      const batch = firebaseDb.batch();

      ticketNumbers.forEach((ticketNumber) => {
        const ticketRef = ticketCollection.doc();
        batch.set(ticketRef, {
          paymentId: id,
          ticketNumber,
          createdAt: new Date(),
        });
      });

      await batch.commit();

      sendEmailNotification(email, userName, ticketNumbers, true);
    }

    return { success: true, message: "Payment updated successfully" };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
