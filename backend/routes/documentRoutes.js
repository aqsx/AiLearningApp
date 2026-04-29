import express from "express";

import {
  uploadDocument,
  getDocuments,
  getDocumentById,   
  deleteDocument,
} from "../controllers/documentController.js";

import { protect } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("file"),
  uploadDocument
);

router.get("/", protect, getDocuments);

router.get("/:documentId", protect, getDocumentById);


router.delete("/:documentId", protect, deleteDocument);

export default router;