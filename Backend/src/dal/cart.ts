import _ from "lodash";
import RollingError from "../utils/error";
import Logger from "../utils/logger";
import * as db from "../init/db";
import { Collection, ObjectId } from "mongodb";

function getCartCollection(): Collection<RollingTypes.Cart> {
  return db.collection<RollingTypes.Cart>("cart");
}

export async function getCart(uid: string): Promise<RollingTypes.Cart> {
  const cart = await getCartCollection().findOne({ uid });
  if (!cart) throw new RollingError(404, "cart not found", "getCart");
  return cart;
}

export async function createCart(
  uid: string,
  cart: RollingTypes.Cart,
): Promise<void> {
  await getCartCollection().updateOne(
    { uid },
    { $setOnInsert: cart },
    { upsert: true },
  );

  Logger.logToDb("create_cart", `Cart created`, uid);
}

export async function updateCart(
  uid: string,
  cart: RollingTypes.Cart,
): Promise<void> {
  await getCartCollection().updateOne(
    { uid },
    { $set: { ...cart, modifiedAt: Date.now() } },
  );
}

export async function updateCartItem(
  uid: string,
  cartItemId: string,
  size: RollingTypes.ProductSize,
  quantity: number,
): Promise<void> {
  const cart = await getCart(uid);
  const itemIndex = _.findIndex(cart.items, { _id: new ObjectId(cartItemId) });

  if (itemIndex > -1) {
    cart.items[itemIndex].size = size;
    cart.items[itemIndex].quantity = quantity;

    let updatedprice = 0;
    _.forEach(cart.items, (item) => {
      updatedprice = updatedprice + item.price * item.quantity;
    });

    cart.totalPrice = updatedprice;
    cart.modifiedAt = Date.now();
  } else {
    throw new RollingError(404, "cart item not found", "updateCartItem");
  }

  await updateCart(uid, cart);
}

export async function deleteCartItem(
  uid: string,
  cartId: string,
): Promise<void> {
  await getCartCollection().updateOne(
    { uid },
    { $pull: { items: { _id: new ObjectId(cartId) } }, $set: {} },
  );
}
