import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import App from "./App.jsx";
import { ThinkingInReact } from "./pages/ThinkingInReact.jsx";
import { AuthLayout } from "./layouts/AuthLayout.jsx";
import { Register } from "./pages/Register.jsx";
import { SignIn } from "./pages/SignIn.jsx";
import { ForgotPassword } from "./pages/ForgotPassword.jsx";
import PhotoBrowser from "./pages/PhotoBrowser.jsx";
import Portal from "./pages/Portal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/thinking-in-react" element={<ThinkingInReact />} />
        <Route path="/photo-browser" element={<PhotoBrowser />} />
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
