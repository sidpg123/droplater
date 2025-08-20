import mongoose, { Schema } from "mongoose";

const AttemptSchema = new mongoose.Schema({
  at: Date,
  statusCode: Number,
  ok: Boolean,
  error: String,
});

const NoteSchema = new Schema(
    {
        title: {
            type: String,
            require: true
        },
        body: {
            type: String,
            require: true
        },
        releaseAt: { 
            type: Date, 
            required: true 
        },
        webhookURL: {
            type: String,
            required: true
        },
        status: { type: String, enum: ["pending", "delivered", "failed", "dead"], default: "pending" },
        attempts: [AttemptSchema],
        deliveredAt: { 
            type: Date, 
            require: false,
            default: null 
        },
    },
    {
        timestamps: true
    }
)

NoteSchema.index({ releaseAt: 1 });
NoteSchema.index({ status: 1 });

export const NoteModel = mongoose.model("Note", NoteSchema);

