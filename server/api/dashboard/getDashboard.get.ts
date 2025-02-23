export default defineEventHandler(async (event) => {
  const paymentsSnapshot = await firebaseDb.collection("payments").get();

  const payments = paymentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return payments;
});
