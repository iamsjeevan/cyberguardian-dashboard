import { Panel } from "@/components/dashboard/Panel";
import { useProcessStore } from "@/stores/processStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Filter } from "lucide-react";
import { useState } from "react";

const SOURCES = ["ALL", "GAN", "SCAN", "SYSTEM"] as const;
const LEVELS = ["ALL", "INFO", "OK", "WARN", "ERROR"] as const;

export default function LogsPage() {
  const { logs, clearLogs } = useProcessStore();
  const [src, setSrc] = useState<typeof SOURCES[number]>("ALL");
  const [lvl, setLvl] = useState<typeof LEVELS[number]>("ALL");

  const filtered = logs.filter(
    (l) => (src === "ALL" || l.source === src) && (lvl === "ALL" || l.level === lvl)
  );

  return (
    <div className="space-y-4">
      <Panel title="System Logs — Unified Telemetry Stream" delay={0} glow live>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <Filter size={12} className="text-muted-foreground" />
          <Pill label="Source" options={SOURCES} value={src} onChange={(v) => setSrc(v as typeof SOURCES[number])} />
          <Pill label="Level" options={LEVELS} value={lvl} onChange={(v) => setLvl(v as typeof LEVELS[number])} />
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-[10px] text-muted-foreground">{filtered.length} ENTRIES</span>
            <button
              onClick={clearLogs}
              className="flex items-center gap-1 px-2 py-1 rounded bg-destructive/15 text-destructive border border-destructive/30 font-mono text-[10px] uppercase hover:bg-destructive/25"
            >
              <Trash2 size={10} /> Clear
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-240px)] overflow-y-auto bg-background/80 border border-border rounded p-2 font-mono text-[10px]">
          <AnimatePresence initial={false}>
            {filtered.map((l) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3 py-0.5 border-b border-border/30"
              >
                <span className="text-muted-foreground shrink-0 w-20">
                  {new Date(l.ts).toLocaleTimeString("en-GB", { hour12: false })}
                </span>
                <span className="text-primary shrink-0 w-12">[{l.source}]</span>
                <span
                  className={`shrink-0 w-12 ${
                    l.level === "OK" ? "text-secondary" :
                    l.level === "WARN" ? "text-warning" :
                    l.level === "ERROR" ? "text-destructive" : "text-foreground/70"
                  }`}
                >
                  {l.level}
                </span>
                <span className="text-foreground/90">{l.message}</span>
              </motion.div>
            ))}
            {!filtered.length && (
              <div className="text-muted-foreground text-center py-12">AWAITING DATA...</div>
            )}
          </AnimatePresence>
        </div>
      </Panel>
    </div>
  );
}

function Pill({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-[10px] text-muted-foreground uppercase">{label}:</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border transition-colors ${
            value === o
              ? "bg-primary/20 text-primary border-primary/40"
              : "bg-background text-muted-foreground border-border hover:text-primary"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
