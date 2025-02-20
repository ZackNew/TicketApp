import { useFirebaseAdmin } from "~/server/utils/firebase";

export default defineEventHandler(async (event) => {
  const admin = useFirebaseAdmin();
  const db = admin.firestore();

  const paymentsSnapshot = await db.collection("payments").get();
  const payments = paymentsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return payments;
});
