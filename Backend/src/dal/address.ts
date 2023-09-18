import RollingError from "../utils/error";
import _ from "lodash";
import * as db from "../init/db";

export function getAddressCollection(
  uid: string,
): FirebaseFirestore.CollectionReference<RollingTypes.Address> {
  return db.collection<RollingTypes.Address>(`users/${uid}/addresses`);
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
  const Address = addressDocs.map((doc) => doc.data());

  return Address;
}

export async function getAddressById(
  uid: string,
  addressId: string,
): Promise<RollingTypes.Address> {
  const snapshot = await getAddressCollection(uid).doc(addressId).get();
  if (!snapshot.exists) {
    throw new RollingError(404, "Address not found");
  }

  return snapshot.data() as RollingTypes.Address;
}

export async function addAddress(
  address: RollingTypes.Address,
  uid: string,
): Promise<void> {
  const addressRef = getAddressCollection(uid);
  const snapshot = await addressRef.get();

  const isDefaultAddressTrue = address.defaultAddress;

  if (snapshot.empty) {
    if (!isDefaultAddressTrue) {
      address.defaultAddress = true;
    }
  } else {
    if (isDefaultAddressTrue) {
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, {
          defaultAddress: false,
        });
      });
      await batch.commit();
    }
  }
  await addressRef.doc(address.addressId).set(address);
}

export async function updateAddress(
  uid: string,
  address: RollingTypes.Address,
): Promise<void> {
  const addressCollectionRef = getAddressCollection(uid);
  const snapshot = await addressCollectionRef.get();
  const isDefaultAddressTrue = address.defaultAddress;

  if (isDefaultAddressTrue) {
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, {
        defaultAddress: false,
      });
    });

    await batch.commit();
  }
  await addressCollectionRef.doc(address.addressId).update(address);
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
