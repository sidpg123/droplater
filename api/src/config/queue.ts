import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null
});

export const noteQueue = new Queue("notes", { 
  defaultJobOptions: {
    attempts: 4,
    backoff: {
      type: "custom"
    }
  },  
  connection
});
