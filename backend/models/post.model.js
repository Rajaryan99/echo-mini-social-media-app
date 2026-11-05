import mongoose from "mongoose";



const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    }],
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
