import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

const pageTitles: Record<string, string> = {
  "/": "Command Center",
  "/training": "Training Control",
  "/network": "Network Topology",
  "/explain": "Action Explanations",
  "/kg": "Knowledge Graph",
  "/game": "Game Theory",
  "/evaluation": "Benchmark Evaluation",
  "/incidents": "Incident Reports",
};

export function AppLayout() {
  const title = pageTitles[window.location.pathname] || "ACD Dashboard";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background grid-bg">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-4 scanline">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
