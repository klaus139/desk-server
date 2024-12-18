import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;  // Destructuring to get Schema and Types from mongoose

const jobHistorySchema = new Schema({
  title: {
    type: String,
    maxlength: 100  // Fixed typo 'maxLenght' to 'maxlength'
  },
  description: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  location: {
    type: String
  },
  interviewDate: {
    type: Date
  },
  applicationStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  user: {
    type: Types.ObjectId,  // Using Types.ObjectId for proper ObjectId reference
    ref: "User",
    required: true
  }
});

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  jobHistory: [jobHistorySchema],
  isAdmin: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

const User = model("User", userSchema);  // Using model to create User model
export default User;
