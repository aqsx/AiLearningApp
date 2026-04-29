import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  ArrowLeft,
  RotateCcw,
  BarChart3,
} from "lucide-react";

import quizService from "../../services/quizService";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
 useEffect(() => {
  const fetchResults = async () => {
    try {
      const data = await quizService.getQuizResults(quizId);

      console.log("FINAL RESULT:", data); // 🔍

      if (!data) {
        toast.error("No results found");
        return;
      }

      setResult(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [quizId]);

  if (loading) return <Spinner />;

  if (!result) {
    return (
      <div className="text-center mt-10 text-slate-500">
        No results found
      </div>
    );
  }

  const { score, totalQuestions, userAnswers = [], questions = [] } = result;

  const percentage = Math.round((score / totalQuestions) * 100);

  /* ================= PERFORMANCE ================= */
  const getPerformanceLabel = () => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 50) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 
      rounded-3xl shadow-xl p-8 text-center">

        <div className="flex justify-center mb-3">
          <BarChart3 className="text-emerald-500" size={28} />
        </div>

        <h2 className="text-xl font-semibold mb-1">
          Quiz Results
        </h2>

        <p className="text-slate-500 mb-6">
          Performance overview
        </p>

        {/* SCORE */}
        <div className="text-5xl font-bold text-emerald-500 mb-3">
          {score} / {totalQuestions}
        </div>

        <div className="text-sm text-slate-500 mb-4">
          {percentage}% • {getPerformanceLabel()}
        </div>

        {/* PROGRESS */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* STATS */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle size={18} />
            {score} Correct
          </div>

          <div className="flex items-center gap-2 text-red-500">
            <XCircle size={18} />
            {totalQuestions - score} Wrong
          </div>
        </div>
      </div>

      {/* REVIEW */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 
      rounded-3xl shadow-xl p-6 flex flex-col gap-4">

        <h3 className="font-semibold text-lg mb-2">
          Answer Review
        </h3>

        {questions.map((q, index) => {
          const user = userAnswers.find(
            (a) => a.questionIndex === index
          );

          const isCorrect = user?.isCorrect;

          return (
            <div
              key={index}
              className="p-5 rounded-2xl border border-slate-200 
              bg-white shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold mb-3 text-slate-800">
                {index + 1}. {q.question}
              </p>

              {/* USER ANSWER */}
              <div className="flex items-center gap-2 text-sm mb-1">
                {isCorrect ? (
                  <CheckCircle className="text-emerald-500" size={18} />
                ) : (
                  <XCircle className="text-red-500" size={18} />
                )}

                <span className="text-slate-600">
                  Your answer:
                </span>

                <span
                  className={`font-medium ${
                    isCorrect
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {user?.selectedAnswer || "Not answered"}
                </span>
              </div>

              {/* CORRECT ANSWER */}
              {!isCorrect && (
                <div className="text-sm text-emerald-600 ml-6">
                  Correct answer: {q.correctAnswer}
                </div>
              )}

              {/* EXPLANATION */}
              {q.explanation && (
                <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-2">

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border hover:bg-slate-100 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          onClick={() => navigate(`/quizzes/${quizId}`)}  
          className="px-6 py-2 rounded-lg text-white 
          bg-gradient-to-r from-emerald-500 to-teal-500 
          shadow-lg flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResultPage;