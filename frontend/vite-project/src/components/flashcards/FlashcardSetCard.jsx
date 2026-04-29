import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, TrendingUp, Play } from "lucide-react";
import moment from "moment";

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate();

  /* ================= NAVIGATION ================= */
  const handleStudy = () => {
    const documentId =
      flashcardSet?.documentId?._id || flashcardSet?.documentId;

    if (!documentId || typeof documentId !== "string") {
      console.error("❌ INVALID DOCUMENT ID:", flashcardSet);
      return;
    }

    navigate(`/documents/${documentId}/flashcards`);
  };

  /* ================= DATA ================= */
  const totalCards = flashcardSet?.cards?.length || 0;

  // 🔥 FIXED: calculate reviewed cards properly
  const reviewed = flashcardSet?.cards?.filter(
    (card) => card.reviewCount > 0
  ).length;

  const progress =
    totalCards > 0 ? Math.round((reviewed / totalCards) * 100) : 0;

  const title =
    flashcardSet?.documentId?.title || "Flashcard Set";

  /* ================= UI ================= */
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between">

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1.5 rounded-lg">
              <BookOpen size={16} className="text-emerald-600" />
            </div>

            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {title}
            </h2>
          </div>

          {/* Time */}
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles size={12} className="text-teal-500" />
            {flashcardSet?.createdAt
              ? moment(flashcardSet.createdAt).fromNow()
              : ""}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {flashcardSet?.description || "No description available"}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>{totalCards} cards</span>
          </div>

          <span className="text-xs text-gray-400">
            {reviewed}/{totalCards} reviewed ({progress}%)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleStudy}
        className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 rounded-xl text-sm shadow transition-all duration-200 hover:scale-[1.02]"
      >
        <Play size={14} />
        {progress > 0 ? "Continue Study" : "Study Now"}
      </button>
    </div>
  );
};

export default FlashcardSetCard;
    
