"use client";

import { Auth } from "@/init/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { getInternetStatus } from "./connection-event";
import Rolling from "@/init/api";

interface SignupData {
  email: string;
  password: string;
  name: string;
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

    const signupResponse = await Rolling.users.create(
      data.name,
      data.email,
      createAuthUser.user.uid
    );

    if (signupResponse.status !== 200) {
      throw signupResponse;
    }

    console.log(signupResponse);
  } catch (e) {
    console.error(e);
  }
}
