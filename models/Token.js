import mongoose from "mongoose";

// TODO(Add expiry to token)
const tokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, "Token must have a value"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Token must have a user"],
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
