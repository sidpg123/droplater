import { Worker } from "bullmq";
import IORedis from "ioredis";
import { deliverNote } from "./jobs/deliverNote";
import { connectDB } from "./config/db";
import { NoteModel } from "./models/Note.model";

const connection = new IORedis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null
});

connectDB();
const noteWorker = new Worker("notes", deliverNote,
  {
    connection,
    settings: {
      backoffStrategy: (attemptsMade: number) => {
        switch (attemptsMade) {
          case 1: {
            console.log("attemptsMade", attemptsMade)
            return 1000;
          }
          case 2: {
            console.log("attemptsMade", attemptsMade)
            return 5000;
          }
          case 3: {
            console.log("attemptsMade", attemptsMade)
            return 25000;
          }
          default :{
            return 0;
          }
        }
    },
    }
  },);

noteWorker.on("completed", (job) => {
  console.log(`Job ${job.id} delivered successfully`);
});

noteWorker.on("failed", async (job, err) => {

  await NoteModel.findByIdAndUpdate(job?.data.noteId, {
    $push: {
      attempts: { at: new Date(), statusCode: 500, ok: false },
    }
  })

  if (job && job.attemptsMade >= 3) {
    const { noteId } = job.data;
    await NoteModel.findByIdAndUpdate(noteId, {
      status: "failed",
    });
    console.log(`🔄 Job ${job.id} marked as failed after ${job.attemptsMade} attempts`);
  }
});
