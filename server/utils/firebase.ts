import admin from "firebase-admin";

export function useFirebaseAdmin() {
  console.log("Firebase Apps Before Initialization:", admin.apps);

  if (!admin.apps.length) {
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"
    );

    if (!credentials.private_key) {
      throw new Error(
        "Missing Firebase private key! Check GOOGLE_APPLICATION_CREDENTIALS."
      );
    }

    // Replace escaped `\n` with actual newlines
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert(credentials),
    });

    console.log("Firebase Admin Initialized!");
  } else {
    console.log("Firebase Admin already initialized.");
  }

  console.log("Firebase Apps After Initialization:", admin.apps);
  return admin;
}
