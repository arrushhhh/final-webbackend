import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    faculties: [{ type: String, trim: true }],
    website: { type: String, default: "" }
  },
  { timestamps: true }
);

export const University = mongoose.model("University", schema);
