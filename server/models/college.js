import mongoose from "mongoose";

const collegeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

export const College = mongoose.model("College", collegeSchema);
