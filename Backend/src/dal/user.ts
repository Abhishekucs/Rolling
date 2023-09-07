import FirebaseAdmin from "../init/firebase-admin";
import _ from "lodash";
import RollingError from "../utils/error";

export function getUserCollection(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin().firestore().collection("users");
}

export async function getUser(
  uid: string,
  stack: string,
): Promise<RollingTypes.User> {
  const userRef = getUserCollection();
  const userDoc = await userRef.doc(uid).get();
  if (!userDoc.exists) throw new RollingError(404, "User not found", stack);

  return userDoc.data() as RollingTypes.User;
}

export async function addUser(
  name: string,
  email: string,
  uid: string,
): Promise<void> {
  const newUserDoc: RollingTypes.User = {
    email,
    uid,
    name,
    addedAt: Date.now(),
    admin: false,
  };
  const userRef = getUserCollection();
  await userRef.doc(uid).set(newUserDoc);
}

export async function updateUser(
  name: string,
  previousName: string,
  uid: string,
): Promise<void> {
  if (name.toLowerCase() === previousName.toLowerCase()) {
    throw new RollingError(400, "New name is same as the Old name");
  }

  const userRef = getUserCollection();
  await userRef.doc(uid).update({
    name,
  });
}

export async function deleteUser(uid: string): Promise<void> {
  const userRef = getUserCollection();
  await userRef.doc(uid).delete();
}
