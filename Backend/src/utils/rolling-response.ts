import { Response } from "express";
import { isCustomCode } from "../constants/rolling-status-code";

export class RollingResponse {
  message: string;
  data: any;
  status: number;

  constructor(message?: string, data?: any, status = 200) {
    this.message = message ?? "ok";
    this.data = data ?? null;
    this.status = status;
  }
}

export function handleRollingResponse(
  rollingResponse: RollingResponse,
  res: Response
): void {
  const { message, data, status } = rollingResponse;

  res.status(status);
  if (isCustomCode(status)) {
    res.statusMessage = message;
  }

  //@ts-ignore ignored so that we can see message in swagger stats
  res.rollingMessage = message;
  if ([301, 302].includes(status)) {
    return res.redirect(data);
  }

  res.json({ message, data });
}
