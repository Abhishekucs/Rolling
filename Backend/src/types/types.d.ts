type ExpressRequest = import("express").Request;

type AddField<T, K extends string, V> = Partial<T> & { [P in K]: V };

declare namespace RollingTypes {
  interface DecodedToken {
    type: "Bearer" | "None";
    uid: string;
    email: string;
  }

  interface Log {
    type?: string;
    timestamp: number;
    uid: string;
    event: string;
    message: string;
  }

  interface Configuration {
    maintenance: boolean;
    users: {
      signUp: boolean;
    };
    admin: {
      endpointsEnabled: boolean;
    };
    product: {
      submissionEnabled: boolean;
    };
    address: {
      submissionEnabled: boolean;
    };
    rateLimiting: {
      badAuthentication: {
        enabled: boolean;
        penalty: number;
        flaggedStatusCodes: number[];
      };
    };
  }

  interface Context {
    configuration: Configuration;
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

  type ProductVariantSize = Array<Record<ProductSize, number>>;

  interface ProductVariant {
    variantId: string;
    color: string;
    colorSKU: number;
    price: number;
    images: Array<string>;
    sizes: ProductVariantSize;
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

  interface CartItem {
    productId: string;
    variantId: string;
    size: number;
    quantity: number;
    price: number;
  }

  interface Cart {
    cartId: string;
    products: CartItem[];
    userId: string;
    totalQuantity: number;
    totalPrice: number;
    createdAt: number;
    modifiedAt: number;
  }
}
