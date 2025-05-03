import sendEmailNotification from "~/server/utils/email-service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (
      !body.email ||
      !body.full_name ||
      !body.image_path ||
      !body.address ||
      !body.phone_number
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields",
      });
    }

    const newPaymentRef = firebaseDb.collection("payments").doc();
    const newPayment = {
      id: newPaymentRef.id,
      ...body,
      createdAt: new Date(),
      status: "pending",
    };

    await newPaymentRef.set(newPayment);
    sendEmailNotification(body.email, body.full_name, [], "confirmation");

    return {
      success: true,
      message: "Payment added successfully",
      data: newPayment,
    };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
