import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router
      // Enable the upcoming React Router v7 behaviors now to remove migration warnings.
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </Router>
  </React.StrictMode>
);
