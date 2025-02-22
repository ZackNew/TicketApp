export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log(body);

    if (
      !body.email ||
      !body.full_name ||
      !body.image_path ||
      !body.number_of_tickets ||
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
