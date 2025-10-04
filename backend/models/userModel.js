import mongoose from "mongoose";

// Subdocument schema for each uploaded file
const fileSchema = new mongoose.Schema({
  DocumentName: { type: String, required: true },
  Dates: { type: Array, required: true },
  entites: { type: Array, required: true },
  obligations: { type: Array, required: true },
  risks: { type: Array, required: true },
  clauses: { type: Array, required: true },
  questions: { type: Array, required: true },
}, { timestamps: true });


// Main user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verifyotp: { type: String, default: "" },
  verifyotpexpireat: { type: Number, default: 0 },
  isaccountverified: { type: Boolean, default: false },
  resetotp: { type: String, default: "" },
  resetotpexpireat: { type: Number, default: 0 },

  // Each user can have multiple files
  files: [fileSchema]
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
