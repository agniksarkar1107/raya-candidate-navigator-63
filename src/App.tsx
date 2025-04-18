import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TalentDiscovery from "./pages/Search";
import NotFound from "./pages/NotFound";
import ResumeScreening from "./pages/ResumeScreening";
import AIAssistant from "./pages/AIAssistant";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Always set to dark mode
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<TalentDiscovery />} />
              <Route path="/resume-screening" element={<ResumeScreening />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
