import { RollingResponse } from "../utils/rolling-response";
import * as AddressDAL from "../dal/address";
import _ from "lodash";
import { ObjectId } from "mongodb";
import { getUser } from "../dal/user";
import RollingError from "../utils/error";

export async function getAllAddress(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  const user = await getUser(uid, "getAllAddress");
  if (!user) throw new RollingError(404, "User not found");

  const Addresses = await AddressDAL.getAllAddress(uid, "getAllAddress");

  return new RollingResponse("addresses retrived", Addresses);
}

export async function createNewAddress(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const {
    name,
    address1,
    address2,
    landmark,
    state,
    city,
    mobileNumber,
    pincode,
    defaultAddress,
  } = req.body;

  const user = await getUser(uid, "createNewAddress");

  if (!user) {
    throw new RollingError(404, "User not found");
  }

  const address: RollingTypes.Address = {
    address1,
    address2,
    _id: new ObjectId(),
    name,
    landmark,
    state,
    city,
    mobileNumber,
    pincode,
    defaultAddress,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    uid: user.uid,
  };

  await AddressDAL.addAddress(address, uid);

  return new RollingResponse("address added");
}

export async function updateAddress(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const {
    name,
    address1,
    address2,
    landmark,
    state,
    city,
    mobileNumber,
    pincode,
    defaultAddress,
  } = req.body;

  const user = await getUser(uid, "deleteAddress");
  if (!user) throw new RollingError(404, "user not found");

  const addressId = req.params["id"];

  const address = await AddressDAL.getAddressById(uid, addressId);

  const updatedAddress: RollingTypes.Address = {
    ...address,
    name,
    address1,
    address2,
    landmark,
    state,
    city,
    mobileNumber,
    pincode,
    defaultAddress,
    modifiedAt: Date.now(),
  };

  await AddressDAL.updateAddress(uid, updatedAddress);

  return new RollingResponse("Address Updated");
}

export async function deleteAddress(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  const user = await getUser(uid, "deleteAddress");
  if (!user) throw new RollingError(404, "user not found");

  const addressId = req.params["id"];

  const address = await AddressDAL.getAddressById(uid, addressId);

  if (!address) throw new RollingError(404, "address not found");

  await AddressDAL.deleteById(uid, addressId);
  return new RollingResponse("address deleted");
}
