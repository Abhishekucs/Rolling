import { ObjectId } from "mongodb";
import * as CartDAL from "../../src/dal/cart";

describe("CartDAL", () => {
  it("should create a cart", async () => {
    const cart: RollingTypes.Cart = {
      _id: new ObjectId(),
      uid: "userId",
      totalPrice: 599,
      totalQuantity: 1,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      items: [
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "s",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
      ],
    };

    const res = await CartDAL.createCart("userId", cart);

    expect(res.insertedId?.toString()).toBe(cart._id.toString());
  });

  it("should update the cart", async () => {
    const cart: RollingTypes.Cart = {
      _id: new ObjectId(),
      uid: "userId",
      totalPrice: 599,
      totalQuantity: 1,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      items: [
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "s",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
      ],
    };

    await CartDAL.createCart("userId", cart);

    const updatedCart: RollingTypes.Cart = {
      ...cart,
      totalPrice: 1198,
      totalQuantity: 2,
      items: [
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "s",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "m",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
      ],
    };

    await CartDAL.updateCart("userId", updatedCart);

    const resCart = await CartDAL.getCart("userId");

    expect(resCart.items.length).toBe(2);
    expect(resCart.totalPrice).toBe(1198);
  });

  it("should update the cartItem", async () => {
    const cart: RollingTypes.Cart = {
      _id: new ObjectId(),
      uid: "userId",
      totalPrice: 599,
      totalQuantity: 1,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      items: [
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "s",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
      ],
    };

    await CartDAL.createCart("userId", cart);

    await CartDAL.updateCartItem(
      "userId",
      cart.items[0]._id.toString(),
      "m",
      2,
    );

    const insertedCart = await CartDAL.getCart("userId");

    expect(insertedCart.totalPrice).toBe(1198);
    expect(insertedCart.items[0].size).toBe("m");
  });

  it("should delete cart Item", async () => {
    const cart: RollingTypes.Cart = {
      _id: new ObjectId(),
      uid: "userId",
      totalPrice: 599,
      totalQuantity: 1,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      items: [
        {
          _id: new ObjectId(),
          productId: "productId",
          variantId: "variantId",
          productName: "test",
          size: "s",
          quantity: 1,
          price: 599,
          imageUrl: "",
        },
      ],
    };

    await CartDAL.createCart("userId", cart);

    await CartDAL.deleteCartItem("userId", cart.items[0]._id.toString());

    const insertedCart = await CartDAL.getCart("userId");
    expect(insertedCart.items.length).toBe(0);
  });
});
