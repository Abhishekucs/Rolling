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

  type CategoryType = "tshirt" | "hoodie";
  type ProductTag = "new" | "old";
  type ProductPriceTag = "expensive" | "cheap";
  type ProductSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";

  interface ProductImage {
    src: string;
    name: string;
    imageId: string;
  }

  interface Product {
    productId: string;
    category: CategoryType;
    name: string;
    price: number;
    tag: ProductTag;
    priceTag: ProductPriceTag;
    inStock: boolean;
    color: string;
    size: ProductSize;
    description: Array<string>;
    images: Array<ProductImage>;
  }

  interface ProductQuery {
    category: string;
    tag: string;
    pricetag: string;
    skip: number;
    limit: number;
    color: string;
    instock: boolean;
  }
}
