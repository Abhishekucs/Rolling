import client from "prom-client";

const Registry = client.Registry;
export const register = new Registry();

export function collectDefaultMetrics(): void {
  client.collectDefaultMetrics({ register });
}
