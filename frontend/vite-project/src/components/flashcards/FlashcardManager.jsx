import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Brain,
  ArrowLeft,
  Trash2,
  ChevronLeft,
} from "lucide-react";

import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Modal from "../common/Modal";
import FlashcardViewer from "./FlashcardViewer";    
import Flashcard from "./Flashcard";

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  /* ================= FETCH ================= */
  const fetchFlashcardSets = async () => {
    setLoading(true);
    try {
      const response =
        await flashcardService.getFlashcardsForDocument(documentId);

      console.log("FLASHCARD FETCH RESPONSE:", response);

      // ✅ SAFE HANDLING
      const data =
        response?.data ||
        response?.flashcards ||
        response ||
        [];

      setFlashcardSets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      toast.error(error?.message || "Failed to fetch flashcards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchFlashcardSets();
  }, [documentId]);

  /* ================= GENERATE ================= */
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId);
      toast.success("Flashcards generated successfully!");

      // ✅ delay fix (important)
      setTimeout(() => {
        fetchFlashcardSets();
      }, 1000);
    } catch (error) {
      toast.error(error?.message || "Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  /* ================= NAVIGATION ================= */
  const handleNextCard = () => {
    if (!selectedSet) return;

    setCurrentCardIndex((prev) =>
      (prev + 1) % selectedSet.cards.length
    );
  };

  const handlePrevCard = () => {
    if (!selectedSet) return;

    setCurrentCardIndex((prev) =>
      (prev - 1 + selectedSet.cards.length) %
      selectedSet.cards.length
    );
  };

  /* ================= DELETE ================= */
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete.id);
      toast.success("Flashcard set deleted");
      setIsDeleteModalOpen(false);
      fetchFlashcardSets();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  /* ================= SELECT ================= */
  const handleSelectedSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  /* ================= VIEWER ================= */
  const renderFlashcardViewer = () => {
    const card = selectedSet?.cards?.[currentCardIndex];

    if (!card) {
      return <p>No cards available</p>;
    }

    return (
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedSet(null)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-black"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="font-semibold">
            {selectedSet.title}
          </h2>
        </div>

        {/* Flashcard */}
        <Flashcard card={card} />

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevCard}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100"
          >
            <ChevronLeft />
          </button>

          <span className="text-sm text-slate-500">
            {currentCardIndex + 1} /{" "}
            {selectedSet.cards?.length || 0}
          </span>

          <button
            onClick={handleNextCard}
            className="px-4 py-2 rounded-lg border hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  /* ================= LIST ================= */
  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="text-center">
          <Brain className="mx-auto mb-4 text-slate-400" size={40} />

          <h3 className="text-lg font-semibold mb-2">
            No Flashcards yet
          </h3>

          <p className="text-sm text-slate-500 mb-6">
            Generate flashcards from your document.
          </p>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="px-6 py-2 rounded-lg text-white font-medium 
            bg-gradient-to-r from-emerald-500 to-teal-500 
            shadow-md hover:shadow-lg"
          >
            {generating ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Generate button */}
        <button
          onClick={handleGenerateFlashcards}
          disabled={generating}
          className="self-start px-4 py-2 rounded-lg text-white text-sm
          bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md"
        >
          <Sparkles size={16} className="inline mr-2" />
          {generating ? "Generating..." : "Generate More"}
        </button>

        {/* List */}
        {flashcardSets.map((set) => (
          <div
            key={set.id}
            onClick={() => handleSelectedSet(set)}
            className="p-5 rounded-2xl border bg-white hover:shadow-md cursor-pointer flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{set.title}</h3>

              {/* ✅ FLASHCARD COUNT FIX */}
              <p className="text-xs text-slate-500">
                {set.cards?.length || 0} cards •{" "}
                {moment(set.createdAt).fromNow()}
              </p>
            </div>

            <button
              onClick={(e) => handleDeleteRequest(e, set)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl p-8">
        {selectedSet
          ? renderFlashcardViewer()
          : renderSetList()}
      </div>

      {/* DELETE MODAL */}
      <Modal
        isModalOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcards"
      >
        <p className="mb-4">Are you sure?</p>

        <button
          onClick={handleConfirmDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </Modal>
    </>
  );
};

export default FlashcardManager;