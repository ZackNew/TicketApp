export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { idToken } = body;

    if (!idToken) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing ID token",
      });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userRef = firebaseDb.collection("users").doc(userId);
    const userSnapshot = await userRef.get();
    const userData = userSnapshot.exists ? userSnapshot.data() : null;

    return {
      success: true,
      message: "Login successful",
      user: {
        id: userId,
        email: decodedToken.email,
        name: userData?.name || "Unknown",
        role: userData?.role || "user",
      },
    };
  } catch (error: any) {
    return createError({
      statusCode: 401,
      statusMessage: error.message || "Unauthorized",
    });
  }
});
