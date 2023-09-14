import _ from "lodash";
import { Response, NextFunction } from "express";
import rateLimit, { Options } from "express-rate-limit";
import RollingError from "../utils/error";
import { RateLimiterMemory } from "rate-limiter-flexible";

const getKey = (req: RollingTypes.Request, _res: Response): string => {
  return (req.headers["cf-connecting-ip"] ||
    req.headers["x-forwarded-for"] ||
    req.ip ||
    "255.255.255.255") as string;
};

const getKeyWithUid = (req: RollingTypes.Request, _res: Response): string => {
  const uid = req?.ctx?.decodedToken?.uid;
  const useUid = uid.length > 0 && uid;

  return (useUid || getKey(req, _res)) as string;
};

const REQUEST_MULTIPLIER = process.env.MODE === "dev" ? 100 : 1;

export const customHandler = (
  _req: RollingTypes.Request,
  _res: Response,
  _next: NextFunction,
  _options: Options,
): void => {
  throw new RollingError(429, "Too many attempts, please try again later.");
};

const ONE_HOUR_SECONDS = 60 * 60;
const ONE_HOUR_MS = 1000 * ONE_HOUR_SECONDS;

export const rootRateLimiter = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 1000 * REQUEST_MULTIPLIER,
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req, _res, _next, _options): void => {
    throw new RollingError(
      429,
      "Maximum API request (root) limit reached. Please try again later.",
    );
  },
});

// Bad Authentication Rate Limiter
export const badAuthRateLimiter = new RateLimiterMemory({
  points: 30 * REQUEST_MULTIPLIER,
  duration: ONE_HOUR_SECONDS,
});

export async function badAuthRateLimiterHandler(
  req: RollingTypes.Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  if (!_.get(req, "ctx.configuration.rateLimiting.badAuthentication.enabled")) {
    return next();
  }

  try {
    const key = getKey(req, res);
    const rateLimitStatus = await badAuthRateLimiter.get(key);

    if (rateLimitStatus !== null && rateLimitStatus?.remainingPoints <= 0) {
      throw new RollingError(
        429,
        "Too many bad authentication attempts, please try again later.",
      );
    }
  } catch (error) {
    return next(error);
  }

  next();
}

export async function incrementBadAuth(
  req: RollingTypes.Request,
  res: Response,
  status: number,
): Promise<void> {
  const { enabled, penalty, flaggedStatusCodes } = _.get(
    req,
    "ctx.configuration.rateLimiting.badAuthentication",
  );

  if (!enabled || !flaggedStatusCodes.includes(status)) {
    return;
  }

  try {
    const key = getKey(req, res);
    await badAuthRateLimiter.penalty(key, penalty);
  } catch (error) {}
}

export const adminLimit = rateLimit({
  windowMs: 5000,
  limit: 1 * REQUEST_MULTIPLIER,
  handler: customHandler,
  keyGenerator: getKeyWithUid,
});

// Users Routing
export const userGet = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 60 * REQUEST_MULTIPLIER,
  keyGenerator: getKeyWithUid,
  handler: customHandler,
});

export const userSignup = rateLimit({
  windowMs: 24 * ONE_HOUR_MS, // 1 day
  limit: 2 * REQUEST_MULTIPLIER,
  keyGenerator: getKey,
  handler: customHandler,
});

export const userDelete = rateLimit({
  windowMs: 24 * ONE_HOUR_MS, // 1 day
  limit: 3 * REQUEST_MULTIPLIER,
  keyGenerator: getKeyWithUid,
  handler: customHandler,
});

export const userRequestVerificationEmail = rateLimit({
  windowMs: ONE_HOUR_MS / 4,
  limit: 1 * REQUEST_MULTIPLIER,
  keyGenerator: getKeyWithUid,
  handler: customHandler,
});

export const userForgotPasswordEmail = rateLimit({
  windowMs: ONE_HOUR_MS / 4,
  limit: 1 * REQUEST_MULTIPLIER,
  keyGenerator: getKeyWithUid,
  handler: customHandler,
});

export const userRevokeAllTokens = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 10 * REQUEST_MULTIPLIER,
  keyGenerator: getKeyWithUid,
  handler: customHandler,
});
