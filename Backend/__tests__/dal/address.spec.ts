import { ObjectId } from "mongodb";
import * as AddressDAL from "../../src/dal/address";

describe("AddressDAL", () => {
  it("should add address", async () => {
    const address: RollingTypes.Address = {
      _id: new ObjectId(),
      uid: "userId",
      name: "test",
      address1: "address1",
      address2: "address2",
      landmark: "landmark",
      pincode: 123456,
      city: "city",
      state: "state",
      mobileNumber: 9876543210,
      defaultAddress: false,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await AddressDAL.addAddress(address, "userId");

    expect(result.insertedId.toString()).toBe(address._id.toString());
  });

  it("should update address", async () => {
    const address: RollingTypes.Address = {
      _id: new ObjectId(),
      uid: "userId",
      name: "test",
      address1: "address1",
      address2: "address2",
      landmark: "landmark",
      pincode: 123456,
      city: "city",
      state: "state",
      mobileNumber: 9876543210,
      defaultAddress: false,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    const result = await AddressDAL.addAddress(address, "userId");

    const updatedAddress: RollingTypes.Address = {
      _id: result.insertedId,
      uid: "userId",
      name: "test2",
      address1: "address2",
      address2: "address1",
      landmark: "landmark1",
      pincode: 123458,
      city: "cite",
      state: "staty",
      mobileNumber: 9876543211,
      defaultAddress: true,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    await AddressDAL.updateAddress("userId", updatedAddress);

    const res = await AddressDAL.getAddressById(
      "userId",
      result.insertedId.toString(),
    );

    expect(res).toStrictEqual(updatedAddress);
  });
});
