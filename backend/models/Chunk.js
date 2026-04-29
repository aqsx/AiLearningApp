import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  chunkIndex: Number,
  pageNumber: Number
}, { timestamps: true });

export default mongoose.model("Chunk", chunkSchema);
