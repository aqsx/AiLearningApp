import React, { useState, useEffect } from "react";

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  /* RESET ON CARD CHANGE */
  useEffect(() => {
    setIsFlipped(false);
  }, [card?.id]);

  if (!card) return null;

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="w-full flex justify-center">
      {/* 🔥 REDUCED WIDTH */}
      <div className="w-[420px] h-64 perspective">
        
        <div
          className={`relative w-full h-full transition-transform duration-500 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT (QUESTION) */}
          <div className="absolute w-full h-full bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center text-center backface-hidden">
            
            <p className="text-lg font-semibold mb-4">
              {card.question || card.front || "No question"}
            </p>

            <button
              onClick={handleFlip}
              className="mt-2 text-sm text-emerald-600 hover:underline"
            >
              Click to reveal answer
            </button>
          </div>

          {/* BACK (ANSWER) */}
          <div className="absolute w-full h-full rounded-2xl shadow-xl p-6 flex flex-col justify-center items-center text-center rotate-y-180 backface-hidden
          
          /* 🔥 THEME COLOR */
          bg-gradient-to-br from-emerald-500 to-teal-500 text-white
          ">
            
            <p className="text-md mb-4 font-medium">
              {card.answer || card.back || "No answer"}
            </p>

            <button
              onClick={handleFlip}
              className="mt-2 text-sm underline text-white/90 hover:text-white"
            >
              Click to see question
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Flashcard;