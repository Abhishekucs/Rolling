import { Collection, ObjectId, WithId } from "mongodb";
import * as db from "../init/db";

function getOrderCollection(): Collection<WithId<RollingTypes.Order>> {
  return db.collection<RollingTypes.Order>("orders");
}

export async function createOrder(order: RollingTypes.Order): Promise<void> {
  await getOrderCollection().insertOne({ ...order, _id: new ObjectId() });
}
