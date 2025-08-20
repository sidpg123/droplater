import { CorsOptions } from "cors";
import crypto from "crypto";

export const corsOptions: CorsOptions = {
    origin: [
        "http://localhost:3000",
        process.env.CLIENT_URL || 'http://localhost:3000',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true
}

export function generateIdempotencyKey(noteId: string, releaseAt: string) {
  return crypto.createHash("sha256").update(`${noteId}:${releaseAt}`).digest("hex");
}