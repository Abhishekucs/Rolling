import FirebaseAdmin from "../init/firebase-admin";
import RollingError from "../utils/error";
import _ from "lodash";

export function getAddressCollection(
  uid: string,
): FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData> {
  return FirebaseAdmin()
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("addresses");
}

export async function getAllAddress(
  uid: string,
  stack: string,
): Promise<Array<RollingTypes.Address>> {
  const addressRef = getAddressCollection(uid);
  const addressSnapshot = await addressRef.get();
  if (addressSnapshot.empty) {
    throw new RollingError(404, "Address is Empty", stack);
  }
  const addressDocs = addressSnapshot.docs;
  const Address = addressDocs.map((doc) => {
    return doc.data() as RollingTypes.Address;
  });

  return Address;
}

export async function addAddress(
  address: RollingTypes.Address,
  uid: string,
): Promise<void> {
  const addressRef = getAddressCollection(uid);
  await addressRef.doc(address.addressId).set(address);
}

export async function updateAddressbyId(
  address: RollingTypes.Address,
  uid: string,
): Promise<void> {
  const addressRef = getAddressCollection(uid);
  await addressRef.doc(address.addressId).update({
    ...address,
  });
}

export async function deleteAllAddress(uid: string): Promise<void> {
  const addressRef = getAddressCollection(uid);
  const addressSnapshot = (await addressRef.get()).docs;

  _.forEach(addressSnapshot, async (snapshot) => {
    await snapshot.ref.delete();
  });
}

export async function deleteById(
  uid: string,
  addressId: string,
): Promise<void> {
  const addressCollectionRef = getAddressCollection(uid);
  await addressCollectionRef.doc(addressId).delete();
}
