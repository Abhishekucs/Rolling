import * as UserDal from "../../src/dal/user";
import * as firebase from "firebase-admin";
import { mockFirebase } from "firestore-jest-mock";

Date.now = jest.fn(() => 1234);

mockFirebase({
  database: {
    users: [
      {
        id: "1",
        uid: "userId",
        name: "mock name",
        email: "mockemail@gmail.com",
        admin: false,
        addedAt: Date.now(),
      },
    ],
  },
});

describe("UserDAl", () => {
  it("should be add new user", async () => {
    const newUser = {
      email: "mockemail@gmail.com",
      uid: "userId",
      name: "mock name",
      addedAt: Date.now(),
      admin: false,
    };

    //await UserDal.addUser(newUser.name, newUser.email, newUser.uid);
    const insertedUser = await UserDal.getUser(newUser.uid, "test");

    expect(insertedUser.name).toBe(newUser.name);
    expect(insertedUser.email).toBe(newUser.email);
    expect(insertedUser.uid).toBe(newUser.uid);
  });
});
