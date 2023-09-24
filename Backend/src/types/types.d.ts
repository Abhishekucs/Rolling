type ExpressRequest = import("express").Request;
type ObjectId = import("mongodb").ObjectId;

// type AddField<T, K extends string, V> = Partial<T> & { [P in K]: V };

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
    order: {
      orderPlacingEnabled: boolean;
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
    _id: ObjectId;
    uid: string;
    name: string;
    address1: string;
    address2: string;
    landmark: string;
    pincode: number;
    city: string;
    state: string;
    mobileNumber: number;
    defaultAddress: boolean;
    createdAt: number;
    modifiedAt: number;
  }

  interface User {
    uid: string;
    email: string;
    name: string;
    addedAt: number;
    admin: boolean;
  }

  type CategoryType = "tshirt" | "hoodie";
  type ProductTag = "new" | "sold out" | "none";
  type ProductSize = "xs" | "s" | "m" | "l" | "xl" | "xxl";

  type ProductVariantSize = { [size: ProductSize]: number }[];

  interface ProductVariant {
    _id: ObjectId;
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
    _id: ObjectId;
    category: CategoryType;
    name: string;
    totalSKU: number;
    variants: Array<ProductVariant>;
    description: Array<string>;
    createdAt: number;
    modifiedAt: number;
  }

  type sort = "expensive" | "cheap" | "new" | "old" | "instock";

  interface ProductFilterOption {
    category?: CategoryType;
    sortBy?: sort;
    color?: string;
    skip?: number;
    limit?: number;
  }

  interface CartItem {
    _id: ObjectId;
    productId: string;
    variantId: string;
    productName: string;
    size: ProductSize;
    quantity: number;
    price: number;
    imageUrl: string;
  }

  interface Cart {
    _id: ObjectId;
    uid: string;
    totalPrice: number;
    totalQuantity: number;
    items: CartItem[];
    createdAt: number;
    modifiedAt: number;
  }

  type OrderStatus = "created" | "attempted" | "paid" | "cancelled" | "none";
  type PaymentMethod =
    | "card"
    | "netbanking"
    | "wallet"
    | "emi"
    | "upi"
    | "none";
  type PaymentStatus =
    | "created"
    | "authorized"
    | "captured"
    | "refunded"
    | "failed"
    | "none";

  interface OrderContact {
    mobileNumber: number;
    email: string;
  }

  interface Order {
    razorpayOrderId: string;
    amount: number;
    totalItems: number;
    products: CartItem[];
    createdAt: number;
    modifiedAt: number;
    paymentAttempts: number;
    status: OrderStatus;
    address: Address;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    tax: number;
    paymentId: string;
    contact: OrderContact;
    uid: string;
  }
}
