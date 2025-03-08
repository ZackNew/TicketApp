export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const status = query.status as string;

  if (!status) {
    throw createError({ statusCode: 400, statusMessage: "Status is required" });
  }

  // Fetch payments based on status
  const paymentsSnapshot = await firebaseDb
    .collection("payments")
    .where("status", "==", status)
    .get();

  // Process payments
  const payments = await Promise.all(
    paymentsSnapshot.docs.map(async (doc) => {
      const paymentData = { id: doc.id, ticketNumber: null, ...doc.data() };

      // Only fetch ticket if status is "approved" or "rejected"
      if (status === "approved" || status === "rejected") {
        const ticketSnapshot = await firebaseDb
          .collection("tickets")
          .where("paymentId", "==", doc.id)
          .limit(1) // Assuming one ticket per payment
          .get();

        if (!ticketSnapshot.empty) {
          const ticketDoc = ticketSnapshot.docs[0];
          paymentData.ticketNumber = ticketDoc.data().ticketNumber;
        }
      }

      return paymentData;
    })
  );

  return payments;
});
