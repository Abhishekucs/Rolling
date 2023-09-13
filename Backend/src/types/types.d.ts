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
  type ProductTag = "new" | "sold out" | "none";
  type ProductSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";

  interface ProductVariantSize {
    size: ProductSize;
    sizeSKU: number;
  }

  interface ProductVariant {
    variantId: string;
    color: string;
    colorSKU: number;
    price: number;
    images: Array<string>;
    sizes: Array<ProductVariantSize>;
    tag: ProductTag;
    createdAt: number;
    modifiedAt: number;
  }

  interface Product {
    productId: string;
    category: CategoryType;
    name: string;
    totalSKU: number;
    variants: Array<ProductVariant>;
    description: Array<string>;
    createdAt: number;
    modifiedAt: number;
  }

  type ProductWithoutVariants = Omit<RollingTypes.Product, "variants">;
}
