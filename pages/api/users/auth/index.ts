import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";
import FirebaseAdminApp = admin.app.App;

import { ISignedPayload, isValid } from "modules/signedPayload";
import { NextApiRequest, NextApiResponse } from "next";


var firebaseApp : FirebaseAdminApp ;
const getFirebaseAdminApp = () => { 
  firebaseApp = firebaseApp ?? admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // due to this coming from an env variable, replace `\` and `n` character pairs w/ single `\n` character
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "firenze-q.appspot.com",
    projectId: "firenze-q.appspot.com",
    databaseURL: "https://firenze-q-default-rtdb.firebaseio.com"
  }) ;

  return firebaseApp;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      const signedPayload: ISignedPayload<string> = req.body.signedPayload;
      console.log(signedPayload);
      
      if (isValid(signedPayload)) {
        try {
          const customToken = await getAuth(getFirebaseAdminApp()).createCustomToken(signedPayload.signer);
          res.status(200).json({ token: customToken });
        } catch (error) {
          console.log("Error creating custom token:", error);
          res.status(500).json({ Error: error });
        }
      } else {
        res.status(400);
        res.statusMessage = "Signed payload was found to be invalid."
      }
    
      break;
    default:
      res.status(405);
  }
}
