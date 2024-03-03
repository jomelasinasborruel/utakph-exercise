"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

import cuid from "cuid";
import dayjs from "dayjs";
import { ref, set } from "firebase/database";
import { animals, colors, uniqueNamesGenerator } from "unique-names-generator";

import { AuthContext } from "./AuthContext";
import { AUTH, DB } from "@/app/firebase";
import { signIn, signOut as nextAuthSignOut } from "next-auth/react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = React.useState<AuthContextProps["session"]>();
  const router = useRouter();

  const logout = () => {
    signOut(AUTH)
      .then(() => {
        nextAuthSignOut();
      })
      .catch((error) => console.log(error));
  };

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(AUTH, email, password).then(() => {
      signIn("credentials", { email: email });
    });
  const createAccount = (email: string, password: string) =>
    createUserWithEmailAndPassword(AUTH, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const newMenuID = cuid();
        const shortName = uniqueNamesGenerator({
          dictionaries: [colors, animals],
          length: 2,
          separator: "-",
        });
        if (user) {
          set(ref(DB, "/users/" + user.uid), {
            email: user.email,
            displayName: shortName,
            createdMenus: { [newMenuID]: true },
            joinedMenus: { [newMenuID]: true },
            dateCreated: dayjs().toISOString(),
          }).catch((err) => console.log(err));

          set(ref(DB, "/menus/" + newMenuID), {
            owner: { id: user.uid, email: user.email, displayName: shortName },
            members: {
              [newMenuID]: {
                create: true,
                read: true,
                update: true,
                delete: true,
              },
            },
            name: "Manu",
            dateCreated: dayjs().toISOString(),
          }).catch((err) => console.log(err));
        }
      })
      .then(() => {
        signIn("credentials", { email: email });
      });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, (auth) => {
      if (auth) {
        setSession({
          email: auth.email,
          uid: auth.uid,
          displayName: auth.displayName,
        });
      } else {
        setSession(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, setSession, logout, login, createAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
