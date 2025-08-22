// import { NoteModel } from "..";
import { NoteModel } from "../models/Note.model";
import axios from "axios";

export async function deliverNote(job: any) {
  try {

    const { noteId, title, body, webhookUrl, releaseAt, idempotencyKey } = job.data;

    console.log("Started job for noteId", noteId, "   ", title);
    console.log("job data", job.data);
    // console.log("webhookUrl", webhookUrl);
    // console.log("idempotencykey", idempotencyKey)
    console.log("")
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
    console.log("status", response.status);
    console.log("message", response.data)


    if (response.status === 500) {
      console.log("error occuerd of 500")
        
      throw new Error("Server down")
    } else {

      await NoteModel.findByIdAndUpdate(noteId, {
        status: "delivered",
        deliveredAt: new Date(),
        $push: {
          attempts: { at: new Date(), statusCode: response.status, ok: true },
        },
      });
    }
  } catch (error) {
    console.log("Error occured");
    throw error;
  }
}
