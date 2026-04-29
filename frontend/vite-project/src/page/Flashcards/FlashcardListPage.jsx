import React, { useState, useEffect } from "react";
import flashcardService from "../../services/flashcardService";
import PageHeader from "../../components/common/PageHeader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import FlashcardSetCard from "../../components/flashcards/FlashcardSetCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FlashcardsListPage = () => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);

      const data = await flashcardService.getAllFlashcardSets();

      console.log("📊 UPDATED FLASHCARDS:", data);

      setFlashcardSets(data || []);
    } catch (error) {
      toast.error("Failed to fetch flashcards");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ INITIAL LOAD */
  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  /* ✅ REFRESH WHEN USER RETURNS TO TAB */
  useEffect(() => {
    const handleFocus = () => {
      console.log("🔄 Refetching flashcards...");
      fetchFlashcardSets();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  /* ================= STUDY ================= */
  const handleStudy = (set) => {
    const docId =
      set?.documentId?._id || // populated
      set?.documentId;

    if (!docId) {
      toast.error("Document not found");
      return;
    }

    navigate(`/documents/${docId}/flashcards`);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (set) => {
    if (!window.confirm("Delete this flashcard set?")) return;

    setDeletingId(set._id);

    try {
      await flashcardService.deleteFlashcardSet(set._id);

      toast.success("Flashcard set deleted");

      setFlashcardSets((prev) =>
        prev.filter((item) => item._id !== set._id)
      );
    } catch (error) {
      toast.error("Failed to delete");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= RENDER ================= */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Spinner />
        </div>
      );
    }

    if (flashcardSets.length === 0) {
      return (
        <div className="mt-10">
          <EmptyState
            title="No flashcards yet"
            description="Go to a document and generate your first flashcard set."
          />
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {flashcardSets.map((set) => (
          <FlashcardSetCard
            key={set._id}
            flashcardSet={set}
            onStudy={() => handleStudy(set)}
            onDelete={() => handleDelete(set)}
            isDeleting={deletingId === set._id}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <PageHeader
          title="Flashcards"
          subtitle="Study smarter with your generated flashcards"
        />
      </div>

      {/* 🔥 OPTIONAL REFRESH BUTTON */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={fetchFlashcardSets}
          className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow hover:scale-105 transition"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default FlashcardsListPage;

