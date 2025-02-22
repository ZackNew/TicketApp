export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { id, status } = body;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing payment ID",
      });
    }

    const paymentRef = firebaseDb.collection("payments").doc(id);
    await paymentRef.update({ status: status, updatedAt: new Date() });

    return { success: true, message: "Payment updated successfully" };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
