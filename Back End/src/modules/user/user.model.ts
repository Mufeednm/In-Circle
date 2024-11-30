import mongoose, { Schema, Document, ObjectId } from "mongoose";

// Interface for the User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  profile_picture?: string;
  bio?: string;
  followers: ObjectId[];
  following: ObjectId[];
  posts: ObjectId[];
  groups: ObjectId[];
  saved: ObjectId[];
  messages: ObjectId[];
  is_active: boolean;
  is_deleted: boolean;
}

// User Schema
const UserSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String ,required: true},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  profile_picture: { type: String },
  bio: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
  saved: [{ type: mongoose.Schema.Types.ObjectId }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  is_active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

// Export User Model
export default mongoose.model<IUser>("User", UserSchema);
