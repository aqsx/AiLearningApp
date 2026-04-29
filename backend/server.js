import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import flashcardRoutes from './routes/flashcardRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ======================
   DATABASE
====================== */
connectDB();

/* ======================
   GLOBAL MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/* ======================
   LOGGER
====================== */
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

/* ======================
   ENSURE UPLOAD FOLDERS EXIST
====================== */
const uploadsPath = path.join(__dirname, 'uploads');
const documentsPath = path.join(uploadsPath, 'documents');

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

if (!fs.existsSync(documentsPath)) {
  fs.mkdirSync(documentsPath);
}

/* ======================
   STATIC FILE SERVING
====================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ======================
   FILE VIEW ROUTE (PDF STREAM)
====================== */
app.get('/api/files/view/:filename', (req, res) => {
  try {
    const { filename } = req.params;

    const filePath = path.join(documentsPath, filename);

    console.log('Looking for file:', filePath);

    if (!fs.existsSync(filePath)) {
      console.error('FILE NOT FOUND:', filePath);
      return res.status(404).send('PDF file not found on server');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=${filename}`
    );

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.error('File streaming error:', error);
    res.status(500).send('Error retrieving file');
  }
});

/* ======================
   HEALTH CHECK
====================== */
app.get('/', (req, res) => {
  res.send('API IS RUNNING');
});

/* ======================
   API ROUTES
====================== */
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);

/* ======================
   ERROR HANDLING
====================== */
app.use(errorHandler);

/* ======================
   404 HANDLER
====================== */
app.use((req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      error: 'API Route not found',
    });
  }
  res.status(404).send('File or Page not found');
});

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});