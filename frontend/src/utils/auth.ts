"use client";

import { Auth } from "@/init/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { getInternetStatus } from "./connection-event";

interface SignupData {
  email: string;
  password: string;
}

export async function signUp(data: SignupData): Promise<void> {
  if (Auth === undefined) {
    console.error("Authentication Uninitialized");
    return;
  }

  if (!getInternetStatus()) {
    console.error("You are offline, Please connect to Internet");
    return;
  }

  let createAuthUser;
  try {
    createAuthUser = await createUserWithEmailAndPassword(
      Auth,
      data.email,
      data.password
    );

    console.log(createAuthUser);
  } catch (e) {
    console.error(e);
  }
}
