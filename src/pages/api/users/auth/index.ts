import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import FirebaseAdminApp = admin.app.App;

import { ISignedPayload, isValid } from "modules/signedPayload";
import { NextApiRequest, NextApiResponse } from "next";

const firebaseAdminApp = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // due to this coming from an env variable, replace `\` and `n` character pairs w/ single `\n` character
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}) as FirebaseAdminApp;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const signedPayload: ISignedPayload<string> = req.body.signedPayload;
  if (isValid(signedPayload)) {
    getAuth(firebaseAdminApp)
      .createCustomToken(signedPayload.signer)
      .then((customToken) => {
        res.status(200).json({ token: customToken });
      })
      .catch((error) => {
        console.log("Error creating custom token:", error);
        error.status(500).json({ Error: error });
      });
  }
}
