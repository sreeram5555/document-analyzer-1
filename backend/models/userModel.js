
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

const fileSchema = new mongoose.Schema({
  DocumentName: { type: String, required: true },
  filePath: { type: String, required: true }, // <-- ADD THIS LINE
  summary: { type: String },
  Dates: { type: Array },
  entites: { type: Array },
  chatHistory: [chatMessageSchema]
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isaccountverified: { type: Boolean, default: false },
  verifyotp: { type: String, default: "" },
  verifyotpexpireat: { type: Number, default: 0 },
  files: [fileSchema]
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;