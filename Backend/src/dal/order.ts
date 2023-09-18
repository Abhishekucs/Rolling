import * as db from "../init/db";

function getOrderCollection(
  uid: string,
): FirebaseFirestore.CollectionReference<RollingTypes.Order> {
  return db.collection<RollingTypes.Order>(`users/${uid}/orders`);
}

export async function createOrder(
  uid: string,
  order: RollingTypes.Order,
): Promise<void> {
  const orderCollectionRef = getOrderCollection(uid);
  await orderCollectionRef.doc(order.orderId).set(order);
}
