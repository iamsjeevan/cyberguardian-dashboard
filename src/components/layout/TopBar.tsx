import { Bell, Wifi, WifiOff } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useEffect, useState } from "react";

export function TopBar({ title }: { title: string }) {
  const { training, isTraining, alerts } = useAppStore();
  const unacked = alerts.filter((a) => !a.acknowledged).length;
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-12 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-4 shrink-0">
      <h1 className="font-display text-sm tracking-widest text-foreground uppercase">{title}</h1>
      
      <div className="ml-auto flex items-center gap-4">
        {/* Clock */}
        <span className="font-mono text-xs text-muted-foreground">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>

        {/* Training status */}
        <div className={`status-badge ${isTraining ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isTraining ? "● TRAINING" : "○ IDLE"}
        </div>

        {/* Step counter */}
        <span className="font-mono text-xs text-muted-foreground">
          STEP: {training.step.toLocaleString()}
        </span>

        {/* WS status */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <WifiOff size={12} />
          <span className="font-mono text-[10px]">DEMO</span>
        </div>

        {/* Alert bell */}
        <button className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell size={16} />
          {unacked > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-mono flex items-center justify-center">
              {unacked}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
