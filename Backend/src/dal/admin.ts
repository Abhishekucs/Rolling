import FirebaseAdmin from "../init/firebase-admin";

function getUserCollection(): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin().firestore().collection("users");
}

export async function isAdmin(uid: string): Promise<boolean> {
  const userCollectionRef = getUserCollection();

  const userDoc = await userCollectionRef
    .where("uid", "==", uid)
    .where("admin", "==", true)
    .get();

  if (userDoc.empty) {
    return false;
  } else {
    return true;
  }
}
