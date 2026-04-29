import React, { useEffect, useState } from "react";
import { Play, Trash2, Sparkles, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import quizService from "../../services/quizService";
import aiService from "../../services/aiService";

import Spinner from "../common/Spinner";
import Button from "../common/Button";

const QuizManager = ({ documentId }) => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  /* ================= FETCH ================= */
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const data = await quizService.getQuizzes(documentId);
      setQuizzes(data || []);
    } catch (error) {
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  /* ================= GENERATE ================= */
  const handleGenerate = async () => {
    try {
      setGenerating(true);
      await aiService.generateQuiz(documentId, 5);
      toast.success("Quiz generated!");
      fetchQuizzes();
    } catch (error) {
      toast.error("Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    try {
      await quizService.deleteQuiz(id);
      toast.success("Deleted");
      fetchQuizzes();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= LOADING ================= */
  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText size={20} />
          Quizzes
        </h2>

        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2"
        >
          <Sparkles size={16} />
          {generating ? "Generating..." : "Generate Quiz"}
        </Button>
      </div>

      {/* EMPTY */}
      {quizzes.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          No quizzes yet. Generate one 🚀
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="group bg-white/80 backdrop-blur-xl 
            border border-slate-200/60 rounded-3xl p-6
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:-translate-y-1 flex flex-col justify-between"
          >

            {/* TOP */}
            <div className="flex flex-col gap-3">

              <div className="flex justify-between items-center">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <FileText size={18} />
                </div>

                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="font-semibold text-lg">
                Quiz
              </h3>

              <p className="text-sm text-slate-500">
                {quiz.totalQuestions} Questions
              </p>
            </div>

            {/* ACTION */}
            <button
              onClick={() => navigate(`/quizzes/${quiz._id}`)}
              className="mt-6 flex items-center justify-center gap-2 
              px-4 py-2 rounded-xl text-white font-medium
              bg-gradient-to-r from-emerald-500 to-teal-500
              shadow-md hover:shadow-lg transition"
            >
              <Play size={16} />
              Start Quiz
            </button>

          </div>
        ))}

      </div>
    </div>
  );
};

export default QuizManager;