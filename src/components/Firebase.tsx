import { useEffect, useState, createContext, useContext } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

import {
  getAuth,
  signInWithCustomToken,
  updateCurrentUser,
} from "firebase/auth";
import { useWeb3Session } from "hooks/web3";

import { ISignedPayload, sign } from "modules/signedPayload";
import invariant from "ts-invariant";

export interface IContext {
  db: Database;
  app: FirebaseApp;
}

const firebaseConfig = {
  apiKey: "AIzaSyAMu0zDHHwPYPf8JkSeSLLTdedkc6SArQQ",
  authDomain: "firenze-q.firebaseapp.com",
  projectId: "firenze-q",
  storageBucket: "firenze-q.appspot.com",
  messagingSenderId: "698512516258",
  appId: "1:698512516258:web:fed85217ffd972f231e3fb",
};

const app = initializeApp(firebaseConfig);
let db = getDatabase(app);
export const Context = createContext<IContext>({ app, db });

export interface IProps {
  children: React.ReactNode | undefined;
}

export const AUTH_MESSAGE = "Authentication message";

export function FirebaseProvider(props: IProps) {
  const { account: address, library, active, chainId } = useWeb3Session();
  const [firebase, setFirebase] = useState<FirebaseApp>(app);

  useEffect(() => {
    async function effect() {
      if (!address) {
        return;
      }

      invariant(!!active && !!chainId, "user must be logged in");
      invariant(!!library, "a provider must be available");

      const payload = {
        message: AUTH_MESSAGE,
      };

      const signedMessage = await sign(library, address, payload);
      // todo: pretty ugly try/catch, make this more reactive?
      try {
        const res = await fetch(`/api/users/auth`, {
          method: "POST",
          body: JSON.stringify({ signedPayload: signedMessage }),
          headers: {
            "content-type": "application/json",
          },
        });

        const body = await res.json();

        const auth = getAuth(app);
        const userCredential = await signInWithCustomToken(auth, body.token);
        const user = userCredential.user;
        await updateCurrentUser(auth, user);
        db = getDatabase(app);

        setFirebase(app);
      } catch (error) {
        console.error(error);
      }
    }

    effect();
  }, [address]);

  return (
    <Context.Provider value={{ app: firebase, db }}>
      {props.children}
    </Context.Provider>
  );
}

export function useFirebase(): IContext {
  const context = useContext(Context);
  return context;
}
