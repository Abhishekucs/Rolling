import _ from "lodash";
import RollingError from "../utils/error";
import * as db from "../init/db";
import { Collection, WithId } from "mongodb";

export function getUserCollection(): Collection<WithId<RollingTypes.User>> {
  return db.collection<RollingTypes.User>("users");
}

export async function getUser(
  uid: string,
  stack: string,
): Promise<RollingTypes.User> {
  const user = await getUserCollection().findOne({ uid });
  if (!user) {
    throw new RollingError(404, "User not found", stack);
  }

  return user;
}

export async function addUser(
  name: string,
  email: string,
  uid: string,
): Promise<void> {
  const newUserDoc: RollingTypes.User = {
    email,
    uid,
    name,
    addedAt: Date.now(),
    admin: false,
  };
  const result = await getUserCollection().updateOne(
    { uid },
    { $setOnInsert: newUserDoc },
    { upsert: true },
  );
  if (result.upsertedCount === 0) {
    throw new RollingError(409, "User document already exists", "addUser");
  }
}

export async function updateUserName(
  name: string,
  previousName: string,
  uid: string,
): Promise<void> {
  if (name.toLowerCase() === previousName.toLowerCase()) {
    throw new RollingError(400, "New name is same as the Old name");
  }

  await getUserCollection().updateOne({ uid }, { $set: { name } });
}

export async function deleteUser(uid: string): Promise<void> {
  await getUserCollection().deleteOne({ uid });
}
