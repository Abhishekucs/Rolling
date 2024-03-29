import _ from "lodash";
import * as IORedis from "ioredis";
import { Worker, Job, ConnectionOptions } from "bullmq";
import Logger from "../utils/logger";
import EmailQueue, {
  EmailTaskContexts,
  EmailType,
} from "../queues/email-queue";
import { sendEmail } from "../init/email-client";

async function jobHandler(job: Job): Promise<void> {
  const type: EmailType = job.data.type;
  const email: string = job.data.email;
  const ctx: EmailTaskContexts[typeof type] = job.data.ctx;

  Logger.info(`Starting job: ${type}`);

  //const start = performance.now();

  const result = await sendEmail(type, email, ctx);

  if (!result.success) {
    console.log("error_sending_email", {
      type,
      email,
      ctx: JSON.stringify(ctx),
      error: result.message,
    });
    throw new Error(result.message);
  }

  //const elapsed = performance.now() - start;
  //recordTimeToCompleteJob(EmailQueue.queueName, type, elapsed);
  Logger.success(`Job: ${type} - completed`);
}

export default (redisConnection?: IORedis.Redis): Worker =>
  new Worker(EmailQueue.queueName, jobHandler, {
    autorun: false,
    connection: redisConnection as ConnectionOptions,
  });
