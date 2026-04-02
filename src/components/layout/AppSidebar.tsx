import { 
  LayoutDashboard, Brain, Network, MessageSquareText, 
  GitBranch, Swords, BarChart3, FileWarning, 
  ChevronLeft, ChevronRight, Wifi, WifiOff, Database
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";

const navItems = [
  { path: "/", label: "Command Center", icon: LayoutDashboard },
  { path: "/training", label: "Training", icon: Brain },
  { path: "/network", label: "Network Map", icon: Network },
  { path: "/explain", label: "Explanations", icon: MessageSquareText },
  { path: "/kg", label: "Knowledge Graph", icon: GitBranch },
  { path: "/game", label: "Game Theory", icon: Swords },
  { path: "/evaluation", label: "Evaluation", icon: BarChart3 },
  { path: "/incidents", label: "Incidents", icon: FileWarning },
];

export function AppSidebar() {
  const { sidebarExpanded, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside className={`${sidebarExpanded ? "w-60" : "w-16"} h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 shrink-0`}>
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
        {sidebarExpanded && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
              <span className="font-display text-primary text-xs">A</span>
            </div>
            <span className="font-display text-sm text-foreground tracking-wider">ACD</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="ml-auto text-muted-foreground hover:text-primary transition-colors">
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all group ${
                isActive
                  ? "bg-sidebar-accent text-primary border-l-2 border-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-accent-foreground border-l-2 border-transparent"
              }`}
            >
              <item.icon size={18} className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground"} />
              {sidebarExpanded && <span className="font-body truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom status */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {sidebarExpanded ? (
          <>
            <StatusDot label="API" connected />
            <StatusDot label="WebSocket" connected={false} />
            <StatusDot label="Database" connected />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <div className="w-2 h-2 rounded-full bg-secondary" />
          </div>
        )}
      </div>
    </aside>
  );
}

function StatusDot({ label, connected }: { label: string; connected: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-secondary" : "bg-destructive"}`} />
      {connected ? <Wifi size={10} className="text-muted-foreground" /> : <WifiOff size={10} className="text-muted-foreground" />}
      <span className="text-muted-foreground font-mono">{label}</span>
    </div>
  );
}
