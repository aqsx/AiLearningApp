
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export async function extractTextFromPDF(filePath) {
  try {
    console.log("=== PDF PARSER START ===");

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    console.log("Pages:", data.numpages);
    console.log("Extracted Length:", data.text.length);

    return {
      text: data.text.trim(),
      numPages: data.numpages,
      info: data.info
    };

  } catch (error) {
    console.error("PDF PARSER ERROR:", error);
    throw error;
  }
}
