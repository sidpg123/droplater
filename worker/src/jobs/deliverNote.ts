// import { NoteModel } from "..";
import { NoteModel } from "../models/Note.model";
import axios from "axios";

export async function deliverNote(job: any) {
  const { noteId, title, body, webhookUrl, releaseAt, idempotencyKey } = job.data;

  // send POST to sink
  const response = await axios.post(
    webhookUrl,
    { noteId, title, body, releaseAt },
    {
      headers: {
        "X-Note-Id": noteId,
        "X-Idempotency-Key": idempotencyKey,
      },
    }
  );
  console.log(response)

  await NoteModel.findByIdAndUpdate(noteId, {
    status: "delivered",
    deliveredAt: new Date(),
    $push: {
      attempts: { at: new Date(), statusCode: response.status, ok: true },
    },
  });
}
