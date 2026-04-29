import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";

import quizService from "../../services/quizService";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await quizService.getQuizById(quizId);

        if (!data) {
          toast.error("Quiz not found");
          return;
        }

        setQuiz(data); // ✅ FIXED
      } catch (error) {
        console.error(error);
        toast.error("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  /* ================= SELECT ANSWER ================= */
  const handleSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ]: option,
    }));
  };

  /* ================= NAVIGATION ================= */
  const next = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  };

  /* ================= FORMAT ANSWERS ================= */
  const formatAnswers = () => {
    return Object.keys(selectedAnswers).map((index) => ({
      questionIndex: Number(index),
      selectedAnswer: selectedAnswers[index],
    }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      const formattedAnswers = formatAnswers();

      if (formattedAnswers.length === 0) {
        return toast.error("Please answer at least one question");
      }

      await quizService.submitQuiz(quizId, formattedAnswers);

      toast.success("Quiz submitted!");

      navigate(`/quizzes/${quizId}/results`); // ✅ match your routes
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Submit failed");
    }
  };

  /* ================= LOADING ================= */
  if (loading) return <Spinner />;

  if (!quiz) {
    return (
      <div className="text-center mt-10 text-slate-500">
        No quiz found
      </div>
    );
  }

  const question = quiz.questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* PROGRESS BAR */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Progress</span>
          <span>
            {currentQ + 1} / {quiz.questions.length}
          </span>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{
              width: `${((currentQ + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 
      rounded-3xl shadow-xl p-8">

        <h3 className="text-lg font-semibold mb-6">
          {question.question}
        </h3>

        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isSelected = selectedAnswers[currentQ] === opt;

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition
                ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-400 shadow-md"
                    : "bg-white hover:shadow-md"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${isSelected ? "border-emerald-500" : "border-slate-300"}`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  )}
                </div>

                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prev}
          disabled={currentQ === 0}
          className="px-4 py-2 rounded-lg border flex items-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Prev
        </button>

        {currentQ === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 rounded-lg border flex items-center gap-2"
          >
            Next
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTakePage;