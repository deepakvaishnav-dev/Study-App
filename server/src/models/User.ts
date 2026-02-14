import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional for now if using 3rd party auth, but required for local
  grade?: string;
  parentEmail?: string;
  isAdmin?: boolean;
  joinedDate: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Hashed
  grade: { type: String },
  parentEmail: { type: String },
  isAdmin: { type: Boolean, default: false },
  joinedDate: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
