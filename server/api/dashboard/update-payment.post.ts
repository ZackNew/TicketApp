import { sendEmailNotification } from "~/server/utils/email-service";
import { generateUniqueTicketNumber } from "~/server/utils/ticketNumberGenerator";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status, userName, email } = body;

    if (!id || !status || !userName) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing payment ID",
      });
    }

    const paymentRef = firebaseDb.collection("payments").doc(id);
    await paymentRef.update({ status: status, updatedAt: new Date() });

    if (status.toLowerCase() === "approved") {
      const ticketNumber = await generateUniqueTicketNumber(userName);

      const ticketData = {
        paymentId: id,
        ticketNumber,
        createdAt: new Date(),
      };

      await firebaseDb.collection("tickets").doc().set(ticketData);

      await sendEmailNotification(email, userName, ticketNumber);
    }

    return { success: true, message: "Payment updated successfully" };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
