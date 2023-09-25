import client, { Counter, Gauge, Histogram } from "prom-client";

const Registry = client.Registry;
export const register = new Registry();

export function collectDefaultMetrics(): void {
  client.collectDefaultMetrics({ register });
}

const auth = new Counter({
  name: "api_request_auth_total",
  help: "Counts authentication events",
  labelNames: ["type"],
});
register.registerMetric(auth);

export function incrementAuth(type: "Bearer" | "ApeKey" | "None"): void {
  auth.inc({ type });
}

const authTime = new Histogram({
  name: "api_request_auth_time",
  help: "Time spent authenticating",
  labelNames: ["type", "status", "path"],
  buckets: [
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000,
  ],
});
register.registerMetric(authTime);

export function recordAuthTime(
  type: string,
  status: "success" | "failure",
  time: number,
  req: RollingTypes.Request,
): void {
  const reqPath = req.baseUrl + req.route.path;

  let normalizedPath = "/";
  if (reqPath !== "/") {
    normalizedPath = reqPath.endsWith("/") ? reqPath.slice(0, -1) : reqPath;
  }

  const pathNoGet = normalizedPath.replace(/\?.*/, "");

  authTime.observe({ type, status, path: pathNoGet }, time);
}

const requestCountry = new Counter({
  name: "api_request_country",
  help: "Country of request",
  labelNames: ["path", "country"],
});
register.registerMetric(requestCountry);

export function recordRequestCountry(
  country: string,
  req: RollingTypes.Request,
): void {
  const reqPath = req.baseUrl + req.route.path;

  let normalizedPath = "/";
  if (reqPath !== "/") {
    normalizedPath = reqPath.endsWith("/") ? reqPath.slice(0, -1) : reqPath;
  }

  const pathNoGet = normalizedPath.replace(/\?.*/, "");

  requestCountry.inc({ path: pathNoGet, country });
}

const clientErrorByVersion = new Counter({
  name: "api_client_error_by_version",
  help: "Client versions which are experiencing 400 errors",
  labelNames: ["version"],
});
register.registerMetric(clientErrorByVersion);

export function recordClientErrorByVersion(version: string): void {
  clientErrorByVersion.inc({ version });
}

const serverVersionCounter = new Counter({
  name: "api_server_version",
  help: "The server's current version",
  labelNames: ["version"],
});
register.registerMetric(serverVersionCounter);

export function recordServerVersion(serverVersion: string): void {
  serverVersionCounter.inc({ version: serverVersion });
}

const tokenCacheAccess = new Counter({
  name: "api_token_cache_access",
  help: "Token cache access",
  labelNames: ["status"],
});

register.registerMetric(tokenCacheAccess);

export function recordTokenCacheAccess(
  status: "hit" | "miss" | "hit_expired",
): void {
  tokenCacheAccess.inc({ status });
}

const tokenCacheSize = new Gauge({
  name: "api_token_cache_size",
  help: "Token cache size",
});
register.registerMetric(tokenCacheSize);

export function setTokenCacheSize(size: number): void {
  tokenCacheSize.set(size);
}

const tokenCacheLength = new Gauge({
  name: "api_token_cache_length",
  help: "Token cache length",
});
register.registerMetric(tokenCacheLength);

export function setTokenCacheLength(length: number): void {
  tokenCacheLength.set(length);
}
