import RollingError from "../utils/error";
import _ from "lodash";
import * as db from "../init/db";
import { Collection, ObjectId } from "mongodb";

export function getAddressCollection(): Collection<RollingTypes.Address> {
  return db.collection<RollingTypes.Address>(`addresses`);
}

export async function getAllAddress(
  uid: string,
  stack: string,
): Promise<RollingTypes.Address[]> {
  const result = await getAddressCollection().find({ uid }).toArray();

  if (!result) throw new RollingError(404, "Addresses not found", stack);

  return result;
}

export async function getAddressById(
  uid: string,
  addressId: string,
): Promise<RollingTypes.Address> {
  const address = await getAddressCollection().findOne({
    uid,
    _id: new ObjectId(addressId),
  });
  if (!address) {
    throw new RollingError(404, "Address not found");
  }

  return address;
}

export async function addAddress(
  address: RollingTypes.Address,
  uid: string,
): Promise<{ insertedId: ObjectId }> {
  const addresses = await getAddressCollection().find({ uid }).toArray();
  const isDefaultAddressTrue = address.defaultAddress;

  if (addresses.length === 0) {
    if (!isDefaultAddressTrue) {
      address.defaultAddress = true;
    }
  } else {
    if (isDefaultAddressTrue) {
      await getAddressCollection().updateMany(
        { uid },
        { $set: { defaultAddress: false } },
      );
    }
  }
  const res = await getAddressCollection().insertOne(address);

  return { insertedId: res.insertedId };
}

export async function updateAddress(
  uid: string,
  address: RollingTypes.Address,
): Promise<void> {
  const isDefaultAddressTrue = address.defaultAddress;

  if (isDefaultAddressTrue) {
    await getAddressCollection().updateMany(
      { uid },
      { $set: { defaultAddress: false } },
    );
  }
  await getAddressCollection().updateOne(
    { _id: new ObjectId(address._id) },
    { $set: address },
  );
}

export async function deleteAllAddress(uid: string): Promise<void> {
  await getAddressCollection().deleteMany({ uid });
}

export async function deleteById(
  uid: string,
  addressId: string,
): Promise<void> {
  await getAddressCollection().deleteOne({ uid, _id: new ObjectId(addressId) });
}
