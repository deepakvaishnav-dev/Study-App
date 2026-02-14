import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  subject?: string;
  chapter?: string;
  type: "text" | "pdf" | "image" | "ai";
  tags: string[];
  isBookmarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String },
    subject: { type: String },
    chapter: { type: String },
    type: {
      type: String,
      enum: ["text", "pdf", "image", "ai"],
      default: "text",
    },
    tags: [String],
    isBookmarked: { type: Boolean, default: false },
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

export default mongoose.model<INote>("Note", NoteSchema);
