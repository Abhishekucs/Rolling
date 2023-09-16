import * as db from "../init/db";
import Logger from "../utils/logger";

function getCartCollection(): FirebaseFirestore.CollectionReference<RollingTypes.Cart> {
  return db.collection<RollingTypes.Cart>("cart");
}

export async function getCartByUserId(
  userId: string,
): Promise<RollingTypes.Cart | null> {
  const query = getCartCollection().where("userId", "==", userId);
  const snapshot = await query.get();

  if (snapshot.empty || snapshot.size === 0) {
    return null;
  }

  Logger.logToDb("getCartByUserId", `${userId} request Cart`, userId);

  return snapshot.docs[0].data();
}

export async function createCart(cart: RollingTypes.Cart): Promise<void> {
  await getCartCollection().doc(cart.cartId).set(cart);
}

export async function updateCart(cart: RollingTypes.Cart): Promise<void> {
  await getCartCollection().doc(cart.cartId).update(cart);
}

export async function deleteCart(cartId: string): Promise<void> {
  await getCartCollection().doc(cartId).delete();
}
