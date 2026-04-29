import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    // ✅ ADD THIS
    fileSize: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },

    extractedText: {
      type: String,
      default: "",
    },

    chunks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chunk",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Document", documentSchema);

        