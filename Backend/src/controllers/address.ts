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

  let address: RollingTypes.Address;
  const addressId = uuidv4();

  try {
    const allAddress = await AddressDAL.getAllAddress(uid, "createNewAddress");
    if (defaultAddress) {
      _.forEach(allAddress, async (address) => {
        const updatedAddress: RollingTypes.Address = {
          ...address,
          defaultAddress: false,
        };
        await AddressDAL.updateAddressbyId(updatedAddress, uid);
      });
    }
    address = {
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
    };
  } catch (error) {
    if (error.status === 404) {
      address = {
        addressId,
        name,
        address1,
        address2,
        landmark,
        state,
        city,
        mobileNumber,
        pincode,
        defaultAddress: true,
      };
    } else {
      throw error;
    }
  }

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

  if (defaultAddress) {
    const allAddress = await AddressDAL.getAllAddress(uid, "createNewAddress");

    _.forEach(allAddress, async (address) => {
      if (address.addressId !== addressId) {
        const updatedAddress: RollingTypes.Address = {
          ...address,
          defaultAddress: false,
        };
        await AddressDAL.updateAddressbyId(updatedAddress, uid);
      }
    });
  }

  const newUpdatedAddress: RollingTypes.Address = {
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
  };

  await AddressDAL.updateAddressbyId(newUpdatedAddress, uid);

  return new RollingResponse("Address Updated");
}
