import { useAppStore } from "@/stores/appStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function StatusBar() {
  const { training, isTraining } = useAppStore();
  const [clock, setClock] = useState(new Date());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      setUptime((u) => u + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmtUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel col-span-full"
    >
      <div className="flex items-center gap-6 px-4 py-2 text-xs font-mono">
        <span className="text-muted-foreground">
          {clock.toLocaleTimeString("en-GB", { hour12: false })} UTC
        </span>
        <span className="text-muted-foreground">UPTIME: {fmtUptime(uptime)}</span>
        
        <div className={`status-badge ${isTraining ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
          {isTraining ? "● TRAINING" : "○ IDLE"}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <ConnDot label="API" ok />
          <ConnDot label="WS" ok={false} />
          <ConnDot label="Neo4j" ok />
          <ConnDot label="Redis" ok />
        </div>

        <span className="text-muted-foreground">
          EP: {Math.floor(training.step / 100).toLocaleString()} | TS: {training.step.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

function ConnDot({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-secondary" : "bg-destructive"}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
