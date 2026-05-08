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
import GANPage from "@/pages/GANPage";
import ScannerPage from "@/pages/ScannerPage";
import LogsPage from "@/pages/LogsPage";
import NotFound from "@/pages/NotFound";
import { useGlobalProcessManager } from "@/hooks/useGlobalProcessManager";

const queryClient = new QueryClient();

const ProcessHost = () => {
  useGlobalProcessManager();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <ProcessHost />
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
            <Route path="/gan" element={<GANPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
