import { Worker } from "bullmq";
import IORedis from "ioredis";
import { deliverNote } from "./jobs/deliverNote";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
});

// Create worker that listens on "notes" queue
const noteWorker = new Worker("notes", deliverNote, { connection });

noteWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} delivered successfully`);
});

noteWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});
