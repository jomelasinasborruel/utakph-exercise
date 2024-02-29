"use client";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

import { AUTH } from "../app/firebase";
import { AuthContext } from "./AuthContaxt";

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
        // Signed up
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log({ errorCode, errorMessage });
        // ..
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(AUTH, (auth) => {
      auth ? setSession({ email: auth.email }) : setSession(null);
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
