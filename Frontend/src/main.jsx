import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/Authcontext.jsx";
import { ClubProvider } from "./context/ClubContext.jsx";
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
