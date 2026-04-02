import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import TrainingPage from "@/pages/TrainingPage";
import NetworkPage from "@/pages/NetworkPage";
import ExplainPage from "@/pages/ExplainPage";
import KGPage from "@/pages/KGPage";
import GamePage from "@/pages/GamePage";
import EvaluationPage from "@/pages/EvaluationPage";
import IncidentsPage from "@/pages/IncidentsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/network" element={<NetworkPage />} />
            <Route path="/explain" element={<ExplainPage />} />
            <Route path="/kg" element={<KGPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/evaluation" element={<EvaluationPage />} />
            <Route path="/incidents" element={<IncidentsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
