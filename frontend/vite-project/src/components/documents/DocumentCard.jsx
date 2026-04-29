import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from "lucide-react";
import moment from "moment";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const DocumentCard = ({ doc, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/documents/${doc._id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🚨 CRITICAL FIX

    console.log("DELETE CLICKED:", doc._id);

    onDelete(doc);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
    >
      {/* HEADER */}
      <div>
        <div className="flex justify-between items-start mb-4">
          
          {/* ICON */}
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <FileText className="text-white w-6 h-6" />
          </div>

          {/* DELETE BUTTON */}
          <button
            onClick={handleDelete}
            className="z-50 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-slate-900 truncate mb-1">
          {doc.title}
        </h3>

        {/* FILE INFO */}
        <p className="text-xs text-slate-500 mb-3">
          {formatFileSize(doc.fileSize)} • {doc.fileType || "PDF"}
        </p>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {doc.flashcardCount !== undefined && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
              {doc.flashcardCount} Flashcards
            </span>
          )}

          {doc.quizCount !== undefined && (
            <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded">
              {doc.quizCount} Quizzes
            </span>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
        <Clock size={12} />
        {moment(doc.createdAt).fromNow()}
      </div>
    </div>
  );
};

export default DocumentCard;