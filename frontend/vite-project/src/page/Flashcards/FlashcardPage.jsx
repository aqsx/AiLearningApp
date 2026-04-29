import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService";

import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import Flashcard from "../../components/flashcards/Flashcard";

const FlashcardPage = () => {
  const { id: documentId } = useParams();

  const [flashcardSet, setFlashcardSet] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  const isValidId =
    documentId &&
    typeof documentId === "string" &&
    documentId !== "[object Object]";

  /* ================= LOAD FLASHCARDS ================= */
  const loadFlashcards = async () => {
    setLoading(true);

    try {
      let res;

      if (isValidId) {
        res = await flashcardService.getFlashcardsForDocument(documentId);
      } else {
        res = await flashcardService.getAllFlashcardSets();
      }

      const raw = res?.data ?? res;

      const data = Array.isArray(raw)
        ? raw
        : raw?.data && Array.isArray(raw.data)
        ? raw.data
        : [];

      if (!data.length) {
        setFlashcards([]);
        return;
      }

      const set = data[0];

      setFlashcardSet(set);
      setFlashcards(set?.cards || []);
      setCurrentCardIndex(0);

    } catch (error) {
      console.error("❌ LOAD ERROR:", error);
      toast.error("Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, [documentId]);

  /* ================= REVIEW FUNCTION ================= */
  const reviewCurrentCard = async () => {
    const currentCard = flashcards[currentCardIndex];
    if (!currentCard || reviewing) return;

    setReviewing(true);

    try {
      await flashcardService.reviewFlashcard(currentCard._id, 1);
      toast.success("Reviewed successfully ✅");
    } catch (error) {
      console.error("❌ REVIEW ERROR:", error);
    } finally {
      setReviewing(false);
    }
  };

  /* ================= NEXT ================= */
  const handleNextCard = async () => {
    await reviewCurrentCard(); // 🔥 REVIEW FIRST

    setCurrentCardIndex((prev) =>
      prev + 1 < flashcards.length ? prev + 1 : 0
    );
  };

  /* ================= PREV ================= */
  const handlePrevCard = () => {
    setCurrentCardIndex((prev) =>
      prev - 1 >= 0 ? prev - 1 : flashcards.length - 1
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Spinner />
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!flashcards.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
        <EmptyState
          title="No flashcards found"
          description="No flashcards available"
        />
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/documents"
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {flashcardSet?.documentId?.title || "Flashcards"}
      </h1>

      {/* Card */}
      <div className="max-w-xl mx-auto">
        <Flashcard card={currentCard} />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <button
          onClick={handlePrevCard}
          className="p-3 rounded-full bg-white shadow hover:bg-emerald-100 transition"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={handleNextCard}
          disabled={reviewing}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:scale-105 transition"
        >
          {reviewing ? "Saving..." : "Next"}
        </button>

        <button
          onClick={handleNextCard}
          className="p-3 rounded-full bg-white shadow hover:bg-emerald-100 transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Progress */}
      <div className="text-center mt-4 text-sm text-gray-500">
        {currentCardIndex + 1} / {flashcards.length}
      </div>
    </div>
  );
};

export default FlashcardPage;