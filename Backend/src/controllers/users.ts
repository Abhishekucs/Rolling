import { RollingResponse } from "../utils/rolling-response";
import FirebaseAdmin from "../init/firebase-admin";
import RollingError from "../utils/error";
import * as UserDAL from "../dal/user";
import { deleteAllAddress } from "../dal/address";
import admin from "firebase-admin";
import emailQueue from "../queues/email-queue";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import Logger from "../utils/logger";

export async function getUser(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  let UserInfo: RollingTypes.User;
  try {
    //call database function here
    UserInfo = await UserDAL.getUser(uid, "get users");
  } catch (error) {
    if (error.status === 404) {
      //if the user is in the auth system but not in the db, its possible that the user was created by bypassing captcha
      //since there is no data in the database anyway, we can just delete the user from the auth system
      //and ask them to sign up again

      await FirebaseAdmin().auth().deleteUser(uid);
      throw new RollingError(
        404,
        "User not found in the database, but found in the auth system. We have deleted the ghost user from the auth system. Please sign up again.",
        "get user",
        uid,
      );
    } else {
      throw error;
    }
  }

  const userData = {
    ...UserInfo,
  };

  return new RollingResponse("User data retrieved", userData);
}

export async function createNewUser(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { email, uid } = req.ctx.decodedToken;
  const { name } = req.body;

  await UserDAL.addUser(name, email, uid);
  Logger.logToDb("user_created", `${name} ${email}`, uid);

  return new RollingResponse("User created");
}

export async function updateUserName(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  const { name } = req.body;

  const user = await UserDAL.getUser(uid, "updateUserName");

  await UserDAL.updateUser(name, user.name, uid);

  Logger.logToDb(
    "user_name_updated",
    `changed name from ${user.name} to ${name}`,
    uid,
  );

  return new RollingResponse("User Name Updated");
}

export async function deleteUser(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;

  const userInfo = await UserDAL.getUser(uid, "delete user");
  await Promise.all([deleteAllAddress(uid), UserDAL.deleteUser(uid)]);

  Logger.logToDb("user_deleted", `${userInfo.email} ${userInfo.name}`, uid);

  return new RollingResponse("User deleted");
}

export async function sendVerificationEmail(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { email, uid } = req.ctx.decodedToken;
  const isVerified = (
    await admin
      .auth()
      .getUser(uid)
      .catch((e) => {
        throw new RollingError(
          500, // this should never happen, but it does. it mightve been caused by auth token cache, will see if disabling cache fixes it
          "Auth user not found, even though the token got decoded",
          JSON.stringify({ uid, email, stack: e.stack }),
          uid,
        );
      })
  ).emailVerified;
  if (isVerified === true) {
    throw new RollingError(400, "Email already verified");
  }

  const userInfo = await UserDAL.getUser(uid, "send verification email");
  if (userInfo.email !== email) {
    throw new RollingError(
      400,
      "Authenticated email does not match the email found in the database. This might happen if you recently changed your email. Please refresh and try again.",
    );
  }

  let link = "";
  try {
    link = await FirebaseAdmin()
      .auth()
      .generateEmailVerificationLink(email, {
        url:
          process.env.MODE === "dev"
            ? "http://localhost:4000"
            : "https://rollingcloth.in", // production domain name may change
      });
  } catch (e) {
    if (
      e.code === "auth/internal-error" &&
      e.message.includes("TOO_MANY_ATTEMPTS_TRY_LATER")
    ) {
      // for some reason this error is not handled with a custom auth/ code, so we have to do it manually
      throw new RollingError(429, "Too many requests. Please try again later");
    }
    if (e.code === "auth/user-not-found") {
      throw new RollingError(
        500,
        "Auth user not found when the user was found in the database",
        JSON.stringify({
          decodedTokenEmail: email,
          userInfoEmail: userInfo.email,
          stack: e.stack,
        }),
        userInfo.uid,
      );
    }
    throw e;
  }

  await emailQueue.sendVerificationEmail(email, userInfo.name, link);

  return new RollingResponse("Email sent");
}

export async function sendForgotPasswordEmail(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { email } = req.body;

  let auth: UserRecord;
  try {
    auth = await FirebaseAdmin().auth().getUserByEmail(email);
  } catch (e) {
    if (e.code === "auth/user-not-found") {
      throw new RollingError(404, "User not found");
    }
    throw e;
  }

  const userInfo = await UserDAL.getUser(
    auth.uid,
    "request forgot password email",
  );

  const link = await FirebaseAdmin()
    .auth()
    .generatePasswordResetLink(email, {
      url:
        process.env.MODE === "dev"
          ? "http://localhost:4000"
          : "https://rollingcloth.in", //domain name may change
    });
  await emailQueue.sendForgotPasswordEmail(email, userInfo.name, link);

  return new RollingResponse("Email sent if user was found");
}

export async function revokeAllTokens(
  req: RollingTypes.Request,
): Promise<RollingResponse> {
  const { uid } = req.ctx.decodedToken;
  await FirebaseAdmin().auth().revokeRefreshTokens(uid);
  return new RollingResponse("All tokens revoked");
}
