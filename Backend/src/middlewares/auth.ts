import { Handler, NextFunction, Response } from "express";
import RollingError from "../utils/error";
import { verifyIdToken } from "../utils/auth";

interface RequestAuthenticationOptions {
  isPublic?: boolean;
  requireFreshToken?: boolean;
  noCache?: boolean;
}

const DEFAULT_OPTIONS: RequestAuthenticationOptions = {
  isPublic: false,
  requireFreshToken: false,
};

function authenticateRequest(authOptions = DEFAULT_OPTIONS): Handler {
  const options = {
    ...DEFAULT_OPTIONS,
    ...authOptions,
  };

  return async (
    req: RollingTypes.Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let token: RollingTypes.DecodedToken;

    const { authorization: authHeader } = req.headers;

    const contentType = req.headers["content-type"];

    try {
      if (authHeader) {
        token = await authenticateWithAuthHeader(authHeader, options);
      } else if (options.isPublic) {
        token = {
          type: "None",
          uid: "",
          email: "",
        };
      } else if (process.env.MODE === "dev") {
        const normalizedContentType = contentType?.startsWith(
          "multipart/form-data",
        );
        if (normalizedContentType) {
          // add the value of uid and email for the predefined admin
          // this is because later "checkIfUserIsAdmin" middleware is used, which require uid in req.ctx
          token = {
            type: "Bearer",
            uid: `${process.env.PREDEFINED_ADMIN_UID}`,
            email: `${process.env.PREDEFINED_ADMIN_EMAIL}`,
          };
        } else token = authenticateWithBody(req.body);
      } else {
        throw new RollingError(
          401,
          "Unauthorized",
          `endpoint: ${req.baseUrl} no authorization header found`,
        );
      }

      req.ctx = {
        ...req.ctx,
        decodedToken: token,
      };
    } catch (error) {
      return next(error);
    }

    next();
  };
}

function authenticateWithBody(
  body: RollingTypes.Request["body"],
): RollingTypes.DecodedToken {
  const { uid, email } = body;

  if (!uid) {
    throw new RollingError(
      401,
      "Running authorization in dev mode but still no uid was provided",
    );
  }

  return {
    type: "Bearer",
    uid,
    email: email ?? "",
  };
}

async function authenticateWithAuthHeader(
  authHeader: string,
  options: RequestAuthenticationOptions,
): Promise<RollingTypes.DecodedToken> {
  const [authScheme, token] = authHeader.split(" ");
  const normalizedAuthScheme = authScheme.trim();

  if (normalizedAuthScheme === "Bearer") {
    return await authenticateWithBearerToken(token, options);
  }

  throw new RollingError(
    401,
    "Unknown authentication scheme",
    `The authentication scheme "${authScheme}" is not implemented`,
  );
}

async function authenticateWithBearerToken(
  token: string,
  options: RequestAuthenticationOptions,
): Promise<RollingTypes.DecodedToken> {
  try {
    const decodedToken = await verifyIdToken(
      token,
      options.requireFreshToken || options.noCache,
    );

    if (options.requireFreshToken) {
      const now = Date.now();
      const tokenIssuedAt = new Date(decodedToken.iat * 1000).getTime();

      if (now - tokenIssuedAt > 60 * 1000) {
        throw new RollingError(
          401,
          "Unauthorized",
          `This endpoint requires a fresh token`,
        );
      }
    }

    return {
      type: "Bearer",
      uid: decodedToken.uid,
      email: decodedToken.email ?? "",
    };
  } catch (error) {
    const errorCode = error?.errorInfo?.code;

    if (errorCode?.includes("auth/id-token-expired")) {
      throw new RollingError(
        401,
        "Token expired - please login again",
        "authenticateWithBearerToken",
      );
    } else if (errorCode?.includes("auth/id-token-revoked")) {
      throw new RollingError(
        401,
        "Token revoked - please login again",
        "authenticateWithBearerToken",
      );
    } else if (errorCode?.includes("auth/user-not-found")) {
      throw new RollingError(
        404,
        "User not found",
        "authenticateWithBearerToken",
      );
    } else if (errorCode?.includes("auth/argument-error")) {
      throw new RollingError(
        400,
        "Incorrect Bearer token format",
        "authenticateWithBearerToken",
      );
    } else {
      throw error;
    }
  }
}

export { authenticateRequest };
