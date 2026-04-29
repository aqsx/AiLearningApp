import mongoose from "mongoose";
import fs from "fs/promises";

import Document from "../models/Document.js";
import Chunk from "../models/Chunk.js";

import { extractTextFromPDF } from "../utils/pdfParser.js";
import { chunkText } from "../utils/textChunker.js";




export const uploadDocument = async (req, res) => {
  try {
    /* ================= AUTH ================= */
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    /* ================= FILE CHECK ================= */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    /* ================= EXTRACT FILE INFO ================= */
    const fileSize = req.file?.size || 0;

    const fileType =
      req.file?.mimetype?.split("/")[1] || "pdf";

    console.log("📄 FILE INFO:", {
      name: req.file.originalname,
      size: fileSize,
      type: fileType,
    });

    /* ================= CREATE DOCUMENT ================= */
    const document = await Document.create({
      userId: req.user._id,
      title: title,
      filename: req.file.originalname,
      filePath: req.file.path,
      fileUrl: `/uploads/documents/${req.file.filename}`,

      // ✅ IMPORTANT FIXES
      fileSize: fileSize,
      fileType: fileType,

      status: "processing",
    });

    /* ================= PROCESS PDF ================= */
    processPDF(document._id, req.file.path);

    /* ================= RESPONSE ================= */
    res.status(201).json({
      success: true,
      data: document,
    });

  } catch (error) {
    console.error("❌ Upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
};

const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPDF(filePath);
    const finalText = text || "";

    if (!finalText) throw new Error("No text extracted");

    const chunks = chunkText(finalText, 500, 50) || [];

    let insertedChunks = [];

    if (chunks.length > 0) {
      const chunkDocs = chunks.map((chunk, index) => ({
        documentId: new mongoose.Types.ObjectId(documentId),
        content: typeof chunk === "string" ? chunk : chunk.content,
        chunkIndex: index,
        pageNumber: null,
      }));

      insertedChunks = await Chunk.insertMany(chunkDocs);
    }

    const chunkIds = insertedChunks.map((c) => c._id);

    await Document.findByIdAndUpdate(documentId, {
      status: "ready",
      extractedText: finalText,
      chunks: chunkIds,
    });
  } catch (err) {
    await Document.findByIdAndUpdate(documentId, {
      status: "failed",
      extractedText: "Processing failed",
    });
  }
};


export const getDocuments = async (req, res) => {
  try {

    const documents = await Document.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents,
    });

  } catch (error) {
    console.error("Fetch documents error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};
export const getDocumentById = async (req, res) => {
  try {

    const { documentId } = req.params;

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      data: document,
    });

  } catch (error) {
    console.error("Fetch document error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    await Chunk.deleteMany({
      documentId: document._id,
    });

    await fs.unlink(document.filePath).catch(() => {});

    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


