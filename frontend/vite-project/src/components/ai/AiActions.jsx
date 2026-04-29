import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, Lightbulb } from "lucide-react";
import aiService from "../../services/aiService";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import MarkdownRenderer from "../common/MarkdownRenderer";

const AiActions = () => {
  const { id } = useParams();

  const [loadingAction, setLoadingAction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [concept, setConcept] = useState("");

  const handleGenerateSummary = async () => {
    setLoadingAction("summary");

    try {
      const res = await aiService.generateSummary(id);
      const summary = res?.data || res?.summary || "No summary";

      setModalContent(summary);
      setModalTitle("Document Summary");
      setIsModalOpen(true);
    } catch {
      toast.error("Failed to generate summary");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleExplainConcept = async (e) => {
  e.preventDefault();

  if (!concept.trim()) {
    toast.error("Please enter a concept");
    return;
  }

  if (!id) {
    toast.error("Invalid document ID");
    return;
  }

  setLoadingAction("explain");

  try {
    const response = await aiService.explainConcept(id, concept);

    console.log("EXPLAIN RESPONSE:", response);

    let explanation =
      response?.answer ||
      response?.data?.answer ||
      response?.data ||
      response;

    // 🔥 CRITICAL FIX → FORCE STRING
    if (typeof explanation === "object") {
      explanation = JSON.stringify(explanation, null, 2);
    }

    setModalContent(explanation || "No explanation generated");
    setModalTitle("Concept Explanation");
    setIsModalOpen(true);

  } catch (error) {
    console.error("EXPLAIN ERROR:", error);
    toast.error(error?.message || "Failed to explain concept");
  } finally {
    setLoadingAction(null);
  }
};

  return (
    <>
      <div className="grid gap-6">

        {/* SUMMARY */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-emerald-500" />
            <h3 className="font-semibold text-lg">Generate Summary</h3>
          </div>

          <p className="text-sm text-slate-500 mb-4">
            Get a concise summary of your document.
          </p>

          <button
            onClick={handleGenerateSummary}
            className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition shadow-sm"
          >
            {loadingAction === "summary" ? "Generating..." : "Summarize"}
          </button>
        </div>

        {/* EXPLAIN */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="text-teal-500" />
            <h3 className="font-semibold text-lg">Explain Concept</h3>
          </div>

          <form onSubmit={handleExplainConcept} className="flex gap-2">
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Enter concept..."
              className="flex-1 px-4 py-2 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-teal-400"
            />

            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition shadow-sm"
            >
              {loadingAction === "explain" ? "..." : "Explain"}
            </button>
          </form>
        </div>

      </div>

      <Modal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <MarkdownRenderer content={modalContent} />
      </Modal>
    </>
  );
};

export default AiActions;