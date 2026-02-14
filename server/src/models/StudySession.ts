import mongoose, { Document, Schema } from "mongoose";

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  subject: string;
  duration: number; // in minutes
  date: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
}

const StudySessionSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export default mongoose.model<IStudySession>(
  "StudySession",
  StudySessionSchema,
);
