"use client";

import { Auth } from "@/init/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Rolling from "@/init/api";

interface SignupData {
  email: string;
  password: string;
  name: string;
}

export async function sendVerificationEmail(): Promise<void> {
  if (Auth === undefined) {
    console.error("Authentication Uninitialized");
    return;
  }

  //Loader.show()
  const result = await Rolling.users.verificationEmail();
  if (result.status !== 200) {
    //Loader.hide();
    console.error("Failed to request verfication email");
  } else {
    //Loader.hide();
    console.log("Verification email sent");
  }
}

export async function signUp(data: SignupData): Promise<void> {
  if (Auth === undefined) {
    console.error("Authentication Uninitialized");
    return;
  }

  let createAuthUser;
  try {
    createAuthUser = await createUserWithEmailAndPassword(
      Auth,
      data.email,
      data.password,
    );

    const signupResponse = await Rolling.users.create(
      data.name,
      data.email,
      createAuthUser.user.uid,
    );

    if (signupResponse.status !== 200) {
      throw signupResponse;
    }

    await sendVerificationEmail();
    console.log(signupResponse);
  } catch (e) {
    console.error(e);
  }
}
