import React, { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Flashcard from "./Flashcard";

const FlashcardViewer = ({ selectedSet, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!selectedSet || !selectedSet.cards?.length) {
    return <p>No cards available</p>;
  }

  const card = selectedSet.cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % selectedSet.cards.length
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + selectedSet.cards.length) %
      selectedSet.cards.length
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-black"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h2 className="font-semibold">{selectedSet.title}</h2>
      </div>

      {/* Flashcard */}
      <Flashcard card={card} />

      {/* Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="px-4 py-2 border rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft />
        </button>

        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {selectedSet.cards.length}
        </span>

        <button
          onClick={handleNext}
          className="px-4 py-2 border rounded-lg hover:bg-slate-100"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default FlashcardViewer;