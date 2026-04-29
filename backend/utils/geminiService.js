import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const extractJSON = (text) => {
  try {
    const cleaned = text.replace(/```json|```/g, "").trim();

    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error("No valid JSON array found in Gemini response");
    }

    return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1));
  } catch (err) {
    console.error("JSON PARSE ERROR:", err);
    console.log("RAW GEMINI OUTPUT:", text);
    throw new Error("Invalid JSON format returned from Gemini");
  }
};


const generateContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result?.response) {
      throw new Error("Empty response from Gemini");
    }

    const text = result.response.text();

    if (!text) {
      throw new Error("Gemini returned empty text");
    }

    return text;
  } catch (error) {
    console.error("GEMINI FULL ERROR:", error);
    throw error;
  }
};


export const generateFlashcardsFromText = async (text, count = 5) => {
  try {
    const trimmedText = text.substring(0, 10000);

    const prompt = `
Generate ${count} flashcards from the text below.

Return ONLY valid JSON array:
[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "easy | medium | hard"
  }
]

Text:
${trimmedText}
`;

    const output = await generateContent(prompt);
    return extractJSON(output);
  } catch (error) {
    console.error("Flashcard generation error:", error);
    throw new Error("Failed to generate flashcards");
  }
};


export const generateQuiz = async (text, numQuestions = 5) => {
  try {
    const trimmedText = text.substring(0, 10000);

    const prompt = `
Generate ${numQuestions} multiple-choice questions.

Return ONLY valid JSON array:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "...",
    "explanation": "...",
    "difficulty": "easy | medium | hard"
  }
]

Text:
${trimmedText}
`;

    const output = await generateContent(prompt);
    return extractJSON(output);
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw new Error("Failed to generate quiz");
  }
};


export const generateSummary = async (text) => {
  try {
    const trimmedText = text.substring(0, 12000);

    const prompt = `Summarize the following text concisely:\n\n${trimmedText}`;

    return await generateContent(prompt);
  } catch (error) {
    console.error("Summary generation error:", error);
    throw new Error("Failed to generate summary");
  }
};


export const chat = async (question, chunks = []) => {
  try {
    const context = chunks
      .map((chunk, i) => `Chunk ${i + 1}:\n${chunk.content || chunk}`)
      .join("\n\n")
      .substring(0, 10000);

    const prompt = `
Use the context below to answer the question.

Context:
${context}

Question:
${question}

Answer:
`;

    return await generateContent(prompt);
  } catch (error) {
    console.error("Chat generation error:", error);
    throw new Error("Failed to generate chat response");
  }
};


export const explainConcept = async (concept, chunks = []) => {
  try {
    const context = chunks
      .map((chunk) => chunk.content || chunk)
      .join("\n\n")
      .substring(0, 10000);

    const prompt = `
Explain this concept clearly and simply.

Concept: ${concept}

Context:
${context}
`;

    return await generateContent(prompt);
  } catch (error) {
    console.error("Concept explanation error:", error);
    throw new Error("Failed to explain concept");
  }
};
