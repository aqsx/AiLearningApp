import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressServices from "../../services/progressServices";
import documentService from "../../services/documentService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { FileText, BookOpen, BrainCircuit, Clock, ArrowRight } from "lucide-react";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [dashBoardData, setDashBoardData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashRes = await progressServices.getDashboardData();

        if (dashRes.success) {
          setDashBoardData(dashRes.data);
        }

        const docRes = await documentService.getDocuments();

        if (docRes.success) {
          setDocuments(docRes.data);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Spinner />;
  if (!dashBoardData) return <div className="p-6">No data available</div>;

  const overview = dashBoardData.overview || {};

  const stats = [
    {
      title: "Documents",
      value: documents.length,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Flashcard Sets",
      value: overview.totalFlashcards ?? 0,
      icon: BookOpen,
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "Quizzes",
      value: overview.totalQuizzes ?? 0,
      icon: BrainCircuit,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const recentActivity = documents.slice(0, 5).map((doc) => ({
    id: doc._id,
    title: doc.title,
    time: doc.createdAt,
    path: `/documents/${doc._id}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">

      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${item.gradient} text-white shadow-lg rounded-2xl p-6 flex justify-between items-center`}
            >
              <div>
                <p className="text-sm opacity-90">{item.title}</p>
                <p className="text-3xl font-bold">{item.value}</p>
              </div>
              <Icon className="w-10 h-10 opacity-90" />
            </div>
          );
        })}
      </div>

      {/* Recent Documents */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
          <Clock className="text-emerald-500" />
          Recent Documents
        </h2>

        {recentActivity.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-gray-50 hover:bg-emerald-50 transition rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <FileText className="text-emerald-600" size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">
                      {doc.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(doc.time).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <button
                  onClick={() => navigate(doc.path)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 transition shadow-sm"
                >
                  View
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;