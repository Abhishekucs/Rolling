import { RollingResponse } from "../utils/rolling-response";
import { v4 as uuidv4 } from "uuid";
import * as AddressDAL from "../dal/address";
import _ from "lodash";

export async function getAllAddress(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

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

  const addressId = uuidv4();
  const address: RollingTypes.Address = {
    address1,
    address2,
    addressId,
    name,
    landmark,
    state,
    city,
    mobileNumber,
    pincode,
    defaultAddress,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
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

  const addressId = req.params["id"];

  const address = await AddressDAL.getAddressById(uid, addressId);

  const updatedAddress: RollingTypes.Address = {
    ...address,
    addressId,
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
  const addressId = req.params["id"];

  await AddressDAL.deleteById(uid, addressId);
  return new RollingResponse("address deleted");
}
