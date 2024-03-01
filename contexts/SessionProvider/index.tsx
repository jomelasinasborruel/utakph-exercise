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

export default function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = React.useState<AuthContextProps["session"]>();
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    signOut(AUTH).then(() => {
      router.push("/sign-in");
    });
  };

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(AUTH, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log({ errorCode, errorMessage });
    });
  };

  const createAccount = (email: string, password: string) => {
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
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log({ errorCode, errorMessage });
      });
  };

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

  const BlankPage = () => (
    <main className="main bg-[#191b30] w-full min-h-[calc(100vh-24px)] mt-6 "></main>
  );
  if (session === undefined) {
    return <BlankPage />;
  }

  if (session && ["/sign-in", "/sign-up"].includes(pathname)) {
    router.push("/");
    return <BlankPage />;
  }

  if (!session && !["/sign-in", "/sign-up"].includes(pathname)) {
    router.push("/sign-in");
    return <BlankPage />;
  }

  return (
    <AuthContext.Provider
      value={{ session, setSession, logout, login, createAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}
