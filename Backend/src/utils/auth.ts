import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import FirebaseAdmin from "../init/firebase-admin";

export async function verifyIdToken(
  idToken: string,
  //noCache = false
): Promise<DecodedIdToken> {
  return await FirebaseAdmin().auth().verifyIdToken(idToken, true); // implement cache checking
}
