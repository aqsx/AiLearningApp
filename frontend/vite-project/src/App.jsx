import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

// Guard
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layout
import AppLayout from "./components/layout/AppLayout";

// Pages
import LoginPage from "./page/Auth/LoginPage";
import RegisterPage from "./page/Auth/Register";
import DashboardPage from "./page/Dashboard/DashboardPage";
import ProfilePage from "./page/Profile/ProfilePage";
import DocumentListPage from "./page/Documents/DocumentListPage";
import DocumentDetailPage from "./page/Documents/DocumentDetailPage";
import FlashcardPage from "./page/Flashcards/FlashcardPage";
import FlashcardListPage from "./page/Flashcards/FlashcardListPage";
import QuizTakePage from "./page/Quizzes/QuizTakePage";
import QuizResultPage from "./page/Quizzes/QuizResultPage";
import NotFound from "./page/Quizzes/NotFoundPage";


const App = () => {

  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>

      <Routes>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />


        {/* Protected + Layout */}
        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />

            <Route
              path="/documents"
              element={<DocumentListPage />}
            />

            <Route
              path="/documents/:id"
              element={<DocumentDetailPage />}
            />

            <Route
              path="/documents/:id/flashcards"
              element={<FlashcardPage />}
            />

            <Route
              path="/flashcards"
              element={<FlashcardListPage />}
            />

            <Route
              path="/quizzes/:quizId"
              element={<QuizTakePage />}

            />

            <Route
              path="/quizzes/:quizId/results"
              element={<QuizResultPage />}
            />
            

          </Route>

        </Route>


        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </Router>
  );
};

export default App;