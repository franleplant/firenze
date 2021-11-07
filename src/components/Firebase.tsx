import { useEffect, useState, createContext, useContext } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
  push,
  remove,
  DataSnapshot,
  Database,
} from "firebase/database";

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

export function FirebaseProvider(props: IProps) {
  return (
    <Context.Provider value={{ app, db }}>{props.children}</Context.Provider>
  );
}

export function useFirebase(): IContext {
  const context = useContext(Context);
  return context;
}
