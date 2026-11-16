import { createRoot } from "react-dom/client";
import App from "./app/App.jsx";
import "./styles/index.css";
import { AuthProvider } from "./app/context/AuthContext";
import { AppDataProvider } from "./app/context/AppDataContext";
import { DarkModeProvider } from "./app/context/DarkModeContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AppDataProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </AppDataProvider>
  </AuthProvider>
);

