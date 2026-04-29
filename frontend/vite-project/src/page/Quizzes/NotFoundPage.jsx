import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">

      <h1 className="text-7xl font-bold text-slate-800 mb-4">
        404
      </h1>

      <p className="text-lg text-slate-500 mb-6">
        Page not found
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 text-white rounded-lg
        bg-gradient-to-r from-emerald-500 to-teal-500
        shadow-md hover:shadow-lg"
      >
        Go Home
      </button>

    </div>
  );
};

export default NotFoundPage;