import _ from "lodash";
import RollingError from "../utils/error";
import Logger from "../utils/logger";
import * as db from "../init/db";

function getCartCollection(
  uid: string,
): FirebaseFirestore.CollectionReference<RollingTypes.CartItem> {
  return db.collection<RollingTypes.CartItem>(`users/${uid}/cart`);
}

export async function getCart(uid: string): Promise<RollingTypes.CartItem[]> {
  const query = getCartCollection(uid);
  const snapshot = await query.get();

  if (snapshot.empty) {
    throw new RollingError(404, "cart is empty");
  }

  const docs = snapshot.docs;
  const cart = _.map(docs, (doc) => doc.data());
  return cart;
}

export async function createCartItem(
  uid: string,
  cartItem: RollingTypes.CartItem,
): Promise<void> {
  await getCartCollection(uid).doc(cartItem._id).set(cartItem);

  Logger.logToDb("create_cart", `Cart created`, uid);
}

export async function updateCartItem(
  uid: string,
  cartItemId: string,
  item: Partial<RollingTypes.CartItem>,
): Promise<void> {
  await getCartCollection(uid)
    .doc(cartItemId)
    .update({ ...item });
}

export async function deleteCartItem(
  uid: string,
  cartId: string,
): Promise<void> {
  Logger.logToDb("delete_cart", `Cart deleted`, uid);
  await getCartCollection(uid).doc(cartId).delete();
}
