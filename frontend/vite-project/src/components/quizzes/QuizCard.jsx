import React, { useState } from "react";

const QuizCard = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  if (!quiz?.questions?.length) {
    return <p>No questions available</p>;
  }

  const question = quiz.questions[currentIndex];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setCurrentIndex((prev) =>
      (prev + 1) % quiz.questions.length
    );
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg p-6">
      
      {/* QUESTION */}
      <h3 className="font-semibold mb-4">
        Q{currentIndex + 1}. {question.question}
      </h3>

      {/* OPTIONS */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(opt)}
            className={`text-left px-4 py-2 rounded-lg border transition 
            ${
              selectedOption === opt
                ? "bg-emerald-500 text-white border-emerald-500"
                : "hover:bg-slate-100"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-slate-500">
          {currentIndex + 1} / {quiz.questions.length}
        </span>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg text-white 
          bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuizCard;