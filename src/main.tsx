import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppkitProvider } from "./provider/AppkitProvider.tsx";
import { Toaster } from "sonner";
import ContractProvider from "./provider/ContractProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppkitProvider>
    <ContractProvider>
        <App />
        <Toaster richColors position="top-right" closeButton />
        </ContractProvider>
    </AppkitProvider>
  </StrictMode>
);
