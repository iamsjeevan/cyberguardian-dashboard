import { Bell, WifiOff, Cpu, MemoryStick } from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { useProcessStore } from "@/stores/processStore";
import { useEffect, useState } from "react";

export function TopBar({ title }: { title: string }) {
  const { training, isTraining, alerts } = useAppStore();
  const { cpu, ram, ganRunning, scanRunning } = useProcessStore();
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
        {/* CPU */}
        <Stat icon={<Cpu size={11} />} label="CPU" value={cpu} unit="%" warn={cpu > 80} />
        {/* RAM */}
        <Stat icon={<MemoryStick size={11} />} label="RAM" value={ram} unit="%" warn={ram > 85} />

        {/* Clock */}
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {clock.toLocaleTimeString("en-GB", { hour12: false })}
        </span>

        {/* Active processes */}
        {ganRunning && (
          <div className="status-badge bg-primary/20 text-primary pulse-green">● GAN</div>
        )}
        {scanRunning && (
          <div className="status-badge bg-secondary/20 text-secondary pulse-green">● SCAN</div>
        )}

        <div className={`status-badge ${isTraining ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isTraining ? "● RL" : "○ IDLE"}
        </div>

        <span className="font-mono text-xs text-muted-foreground">
          STEP: {training.step.toLocaleString()}
        </span>

        <div className="flex items-center gap-1 text-muted-foreground">
          <WifiOff size={12} />
          <span className="font-mono text-[10px]">DEMO</span>
        </div>

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

function Stat({ icon, label, value, unit, warn }: { icon: React.ReactNode; label: string; value: number; unit: string; warn?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={warn ? "text-warning" : "text-muted-foreground"}>{icon}</span>
      <span className="font-mono text-[10px] text-muted-foreground uppercase">{label}</span>
      <div className="w-14 h-1.5 bg-background rounded-full overflow-hidden border border-border">
        <div
          className={`h-full transition-all ${warn ? "bg-warning" : "bg-primary"}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`font-mono text-[10px] tabular-nums w-9 ${warn ? "text-warning" : "text-foreground"}`}>
        {value.toFixed(0)}{unit}
      </span>
    </div>
  );
}
