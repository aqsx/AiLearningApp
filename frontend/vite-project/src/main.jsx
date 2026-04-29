import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast"; // Switched to match your LoginPage logic
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* react-hot-toast Toaster component */}
      <Toaster position="top-right" reverseOrder={false} />
      <App />
    </AuthProvider>
  </StrictMode>
);


