export async function generateUniqueTicketNumbers(
  userName: string,
  count: number
): Promise<string[]> {
  const prefix = "GT";
  const namePart = userName.slice(0, 2).toUpperCase();

  const counterRef = firebaseDb.collection("metadata").doc("ticketCounter");
  const counterDoc = await counterRef.get();
  let ticketCount = counterDoc.exists ? counterDoc.data()?.count || 0 : 0;

  let ticketNumbers: string[] = [];

  for (let i = 0; i < count; i++) {
    ticketCount++;
    ticketNumbers.push(
      `${prefix}${namePart}${ticketCount.toString().padStart(5, "0")}`
    );
  }

  await counterRef.set({ count: ticketCount }, { merge: true });

  return ticketNumbers;
}
