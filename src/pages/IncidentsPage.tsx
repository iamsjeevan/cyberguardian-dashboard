import { Panel } from "@/components/dashboard/Panel";
import { useState } from "react";
import { motion } from "framer-motion";
import { useIncidents } from "@/hooks/useApiData";

const sevStyle: Record<string, string> = {
  CRITICAL: "bg-destructive/20 text-destructive",
  HIGH: "bg-warning/20 text-warning",
  MEDIUM: "bg-primary/20 text-primary",
};
const statStyle: Record<string, string> = {
  OPEN: "text-destructive",
  INVESTIGATING: "text-warning",
  RESOLVED: "text-secondary",
};

export default function IncidentsPage() {
  const { data: incidents } = useIncidents();
  const [selected, setSelected] = useState<string | null>(null);
  const sel = (incidents ?? []).find(i => i.id === selected);

  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="Incident List" className="col-span-5" delay={0}>
        <div className="space-y-1.5">
          {(incidents ?? []).map((inc, i) => (
            <motion.button
              key={inc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(inc.id)}
              className={`w-full text-left p-3 rounded border text-xs transition-colors ${
                selected === inc.id ? "border-primary/50 bg-primary/10" : "border-border bg-surface-elevated hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-foreground font-semibold">{inc.id}</span>
                <span className={`status-badge ${sevStyle[inc.severity] ?? "bg-muted text-muted-foreground"}`}>{inc.severity}</span>
                <span className={`ml-auto font-mono text-[10px] ${statStyle[inc.status] ?? "text-muted-foreground"}`}>{inc.status}</span>
              </div>
              <p className="text-muted-foreground">{inc.message}</p>
              <span className="font-mono text-[10px] text-muted-foreground mt-1 block">{inc.host} — {new Date(inc.timestamp).toLocaleString()}</span>
            </motion.button>
          ))}
        </div>
      </Panel>

      <div className="col-span-7">
        {sel ? (
          <Panel title={`Incident Report: ${sel.id}`} glow delay={1}>
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <span className={`status-badge ${sevStyle[sel.severity] ?? "bg-muted text-muted-foreground"}`}>{sel.severity}</span>
                  <span className={`font-mono ${statStyle[sel.status] ?? "text-muted-foreground"}`}>{sel.status}</span>
                </div>
                <h3 className="font-display text-foreground text-sm">Incident Summary</h3>
                <p className="text-foreground/80">{sel.message}</p>
                <h3 className="font-display text-foreground text-sm">Affected Host</h3>
                <p className="font-mono text-primary">{sel.host}</p>
                <h3 className="font-display text-foreground text-sm">Timeline</h3>
                <p className="font-mono text-muted-foreground">{new Date(sel.timestamp).toLocaleString()} — Incident detected and automated response initiated</p>
                <h3 className="font-display text-foreground text-sm">Automated Response</h3>
                <p className="text-foreground/80">Host isolated from network. Forensic snapshot captured. Alert escalated to SOC team.</p>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="Incident Detail" delay={1}>
            <div className="flex items-center justify-center h-40">
              <span className="font-mono text-xs text-muted-foreground animate-glow-pulse">SELECT AN INCIDENT...</span>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
