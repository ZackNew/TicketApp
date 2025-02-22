export async function generateUniqueTicketNumber(
  userName: string
): Promise<string> {
  const prefix = "GT";
  const namePart = userName.slice(0, 2).toUpperCase();

  const counterRef = firebaseDb.collection("metadata").doc("ticketCounter");
  const counterDoc = await counterRef.get();
  let ticketCount = counterDoc.exists ? counterDoc.data()?.count || 0 : 0;

  ticketCount++;
  await counterRef.set({ count: ticketCount }, { merge: true });

  return `${prefix}${namePart}${ticketCount.toString().padStart(5, "0")}`;
}
