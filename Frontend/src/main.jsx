import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";

import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/Authcontext.jsx";
import { ClubProvider } from "./context/ClubContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ClubProvider>
    <MantineProvider>
      <App />
    </MantineProvider>
    </ClubProvider>
  </AuthProvider>
);
