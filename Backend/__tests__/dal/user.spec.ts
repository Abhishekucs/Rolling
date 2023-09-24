import * as UserDAL from "../../src/dal/user";

describe("UserDAl", () => {
  it("should add new user", async () => {
    const newUser = {
      email: "mockemail@gmail.com",
      uid: "userId",
      name: "mock name",
    };

    await UserDAL.addUser(newUser.name, newUser.email, newUser.uid);
    const insertedUser = await UserDAL.getUser(newUser.uid, "test");

    expect(insertedUser.name).toBe(newUser.name);
    expect(insertedUser.email).toBe(newUser.email);
    expect(insertedUser.uid).toBe(newUser.uid);
  });

  it("should throw error if the user already exists", async () => {
    const newUser = {
      email: "mockemail@gmail.com",
      uid: "userId",
      name: "mock name",
    };

    await UserDAL.addUser(newUser.name, newUser.email, newUser.uid);

    await expect(
      UserDAL.addUser(newUser.name, newUser.email, newUser.uid),
    ).rejects.toThrow("User document already exists");
  });

  it("updateUserName should change the name of user", async () => {
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    await UserDAL.updateUserName(
      "renamedTestUser",
      testUser.name,
      testUser.uid,
    );

    const updatedUser = await UserDAL.getUser(testUser.uid, "test");
    expect(updatedUser.name).toBe("renamedTestUser");
  });
});
