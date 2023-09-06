import { Auth } from "@/init/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";

async function signUp(): Promise<void> {
  if (Auth === undefined) {
    console.error("Authentication Uninitialized");
    return;
  }
}
