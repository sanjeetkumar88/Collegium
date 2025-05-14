import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/Authcontext";
import { ClubProvider } from "./context/ClubContext";
import { ModalsProvider } from '@mantine/modals'; 

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ClubProvider>
      <MantineProvider>
        <ModalsProvider>
          <App />
          <ToastContainer /> {/* Add ToastContainer here */}
        </ModalsProvider>
      </MantineProvider>
    </ClubProvider>
  </AuthProvider>
);
