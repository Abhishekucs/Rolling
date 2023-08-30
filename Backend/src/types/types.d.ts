type ExpressRequest = import("express").Request;

declare namespace RollingTypes {
  interface DecodedToken {
    type: "Bearer" | "None";
    uid: string;
    email: string;
  }

  interface Context {
    decodedToken: DecodedToken;
  }

  interface Request extends ExpressRequest {
    ctx: Readonly<Context>;
  }

  interface Address {
    addressId: string;
    name: string;
    address1: string;
    address2: string;
    landmark: string;
    pincode: number;
    city: string;
    state: string;
    mobileNumber: number;
    defaultAddress?: boolean;
  }

  interface User {
    uid: string;
    email: string;
    name: string;
    addedAt: number;
    admin?: boolean;
  }
}
