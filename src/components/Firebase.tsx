import { useEffect, useState, createContext, useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { initializeApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

import { getAuth, signInWithCustomToken } from "firebase/auth";
import { useWeb3Session } from "hooks/web3";

import { ISignedPayload, sign } from "modules/signedPayload";
import useLibrary from "client/modules/wallet/useLibrary";
import { useWeb3React } from "client/modules/wallet";
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
const db = getDatabase(app);
export const Context = createContext<IContext>({ app, db });

export interface IProps {
  children: React.ReactNode | undefined;
}

export const AUTH_MESSAGE = "Authentication message";

export function FirebaseProvider(props: IProps) {
  const { account: address } = useWeb3Session();
  const [firebase, setFirebase] = useState<FirebaseApp | undefined>();

  const library = useLibrary();
  const { account, active, chainId } = useWeb3React();

  useEffect(() => {
    async function effect() {
      if (!address) {
        return;
      }

      invariant(!!active && !!account && !!chainId, "user must be logged in");
      invariant(!!library, "a provider must be available");
      
      const payload = {
        message: AUTH_MESSAGE,
      };
      
      const signedMessage = await sign(library, account, payload);
      // todo: pretty ugly trycatch, make this more reactive?      
      try {
        const res = await fetch(`/api/users/auth`, {
          method: "POST",
          body: JSON.stringify({ signedPayload: signedMessage}),
          headers: {
            "content-type": "application/json",
          },
        });
        
        const body = await res.json();
        
        const firebaseApp = initializeApp(firebaseConfig);
        const auth = getAuth(firebaseApp);
        const userCredential = await signInWithCustomToken(auth, body.token);
        const user = userCredential.user;
        setFirebase(app);
      } catch (error) {
            console.error(error);
        }
      }

    effect();
  }, [address]);

  return (
    <Context.Provider value={{ app, db }}>{props.children}</Context.Provider>
  );
}

export function useFirebase(): IContext {
  const context = useContext(Context);
  return context;
}
