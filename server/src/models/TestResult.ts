import mongoose, { Document, Schema } from "mongoose";

export interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  weakTopics: string[];
  detailedReport?: string;
  date: Date;
}

const TestResultSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number },
  weakTopics: [String],
  detailedReport: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ITestResult>("TestResult", TestResultSchema);
