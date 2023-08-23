import mongoose from "mongoose";

const userSchema = await mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString(),
  },
  password: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
});

const jobSchema = await mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString(),
  },
});

export const UserModel = mongoose.model("users", userSchema);
export const JobModel = mongoose.model("jobs", jobSchema);
