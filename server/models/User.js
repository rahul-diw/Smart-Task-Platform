import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{

  name: String,
  email: String,
  password: String,


  profilePic: {
  type: String,
  default: "",
},

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member"
  }
},
{
  timestamps: true
}
);

const User = mongoose.model("User", userSchema);

export default User;