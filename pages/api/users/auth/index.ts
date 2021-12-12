import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import FirebaseAdminApp = admin.app.App;

import { ISignedPayload, isValid } from "modules/signedPayload";
import { NextApiRequest, NextApiResponse } from "next";

let firebaseApp: FirebaseAdminApp;

export function getFirebaseAdminApp(): FirebaseAdminApp {
  if (!firebaseApp) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // due to this coming from an env variable, replace `\` and `n` character pairs w/ single `\n` character
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      storageBucket: "firenze-q.appspot.com",
      projectId: "firenze-q.appspot.com",
      databaseURL: "https://firenze-q-default-rtdb.firebaseio.com",
    });
  }

  return firebaseApp;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  switch (req.method) {
    case "POST": {
      const signedPayload: ISignedPayload<string> = req.body.signedPayload;

      if (!isValid(signedPayload)) {
        res.statusMessage = "Signed payload was found to be invalid.";
        return res.status(400).json({ Error: "Invalid signed payload" });
      }

      try {
        const customToken = await getAuth(
          getFirebaseAdminApp()
        ).createCustomToken(signedPayload.signer);
        return res.status(200).json({ token: customToken });
      } catch (error) {
        console.log("Error creating custom token:", error);
        return res.status(500).json({ Error: error });
      }
    }
    default: {
      res.status(405);
    }
  }
}
