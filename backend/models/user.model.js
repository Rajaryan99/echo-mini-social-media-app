import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 16,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    bio: {
      type: String,
      maxlength: 160,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const hassedPassword = async function (password) {
  const bcrypt = await import("bcrypt");
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hassedPassword(this.password);
  next();
});

export const User = mongoose.model("User", userSchema);
