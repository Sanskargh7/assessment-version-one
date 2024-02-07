import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      allowNull: true,
    },
    phone: {
      type: String,
      required: true,
    },
    verifyStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      allowNull: false,
      default: 1
    },
    emailStatus: {
      type: Boolean,
      default: false
    },
    location: {
      type: String,
      default: 'Jaipur'

    },
    center: {
      type: String,
      default: 'Inbound Academy'
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
