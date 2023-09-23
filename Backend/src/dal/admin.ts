import * as db from "../init/db";
import { Collection, WithId } from "mongodb";

function getUserCollection(): Collection<WithId<RollingTypes.User>> {
  return db.collection<RollingTypes.User>("users");
}

// TODO: create a separate collection for storing only uids of admins
export async function isAdmin(uid: string): Promise<boolean> {
  const user = await getUserCollection().findOne({ uid });
  if (user?.admin) {
    return true;
  } else {
    return false;
  }
}
