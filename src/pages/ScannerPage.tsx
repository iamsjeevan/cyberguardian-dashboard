import { Panel } from "@/components/dashboard/Panel";
import { useProcessStore, type ScanHost } from "@/stores/processStore";
import { motion, AnimatePresence } from "framer-motion";
import { Radar, Play, Square, X, Wifi } from "lucide-react";
import { useState } from "react";

export default function ScannerPage() {
  const { scanRunning, scanProgress, scanTarget, scanHosts, setScanTarget, startScan, stopScan } =
    useProcessStore();
  const [selected, setSelected] = useState<ScanHost | null>(null);

  return (
    <div className="space-y-4">
      <Panel title="Network Discovery — Nmap Probe" delay={0} glow>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[260px]">
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Target IP / Range</div>
            <input
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              disabled={scanRunning}
              className="w-full bg-background border border-border rounded px-3 py-2 font-mono text-xs text-primary focus:outline-none focus:border-primary disabled:opacity-50"
            />
          </label>
          <button
            onClick={scanRunning ? stopScan : startScan}
            className={`flex items-center gap-2 px-4 py-2 rounded border font-mono uppercase text-xs tracking-wider transition-all ${
              scanRunning
                ? "bg-destructive/20 text-destructive border-destructive/40 hover:bg-destructive/30 pulse-red"
                : "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30"
            }`}
          >
            {scanRunning ? <Square size={14} /> : <Play size={14} />}
            {scanRunning ? "Stop Scan" : "Start Scan"}
          </button>
          <div className="text-[10px] font-mono text-muted-foreground">
            {scanRunning ? `PROBING · ${scanProgress.toFixed(0)}%` : `${scanHosts.length} HOSTS`}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-12 gap-4">
        {/* Radar */}
        <Panel title="Radar Sweep" className="col-span-4" live={scanRunning} delay={1} glow>
          <div className="relative aspect-square w-full">
            <RadarSweep active={scanRunning} hosts={scanHosts.length} />
          </div>
        </Panel>

        {/* Hosts table */}
        <Panel title="Live Hosts" className="col-span-8" delay={2}>
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-muted-foreground border-b border-border uppercase text-[10px]">
                  <th className="text-left py-2 px-2">IP</th>
                  <th className="text-left px-2">MAC</th>
                  <th className="text-left px-2">Vendor</th>
                  <th className="text-left px-2">Open Ports</th>
                  <th className="text-left px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {scanHosts.map((h) => (
                    <motion.tr
                      key={h.ip}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => setSelected(h)}
                      className="border-b border-border/50 cursor-pointer hover:bg-primary/5"
                    >
                      <td className="py-2 px-2 text-primary glow-text">{h.ip}</td>
                      <td className="px-2 text-foreground/80">{h.mac}</td>
                      <td className="px-2 text-muted-foreground">{h.vendor}</td>
                      <td className="px-2">
                        <div className="flex gap-1 flex-wrap">
                          {h.ports.map((p) => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-secondary/10 text-secondary text-[9px]">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-2">
                        <span
                          className={`status-badge ${
                            h.status === "Active"
                              ? "bg-secondary/15 text-secondary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          ● {h.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {!scanHosts.length && !scanRunning && (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground font-mono text-xs">
                      AWAITING DATA... press START SCAN
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 flex justify-end"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[420px] h-full bg-card border-l border-primary/30 p-5 overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-display text-xs text-muted-foreground tracking-wider">HOST DETAIL</div>
                  <div className="font-mono text-xl text-primary glow-text">{selected.ip}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-primary">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <Detail k="Hostname" v={selected.hostname} />
                <Detail k="MAC Address" v={selected.mac} />
                <Detail k="Vendor" v={selected.vendor} />
                <Detail k="OS Detection" v={selected.os} />
                <Detail k="Latency" v={selected.latency} />
                <Detail k="Status" v={selected.status} />
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground mb-1">Open Ports</div>
                  <div className="grid grid-cols-3 gap-1">
                    {selected.ports.map((p) => (
                      <div key={p} className="bg-background border border-border rounded px-2 py-1 text-secondary">
                        :{p}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-background/60 border border-border rounded text-[10px] leading-relaxed text-muted-foreground">
                  <div className="text-primary mb-1">// nmap -sV -O {selected.ip}</div>
                  Starting Nmap 7.94 ({selected.ip})<br />
                  Host is up ({selected.latency} latency)<br />
                  OS: {selected.os}<br />
                  MAC Address: {selected.mac} ({selected.vendor})<br />
                  {selected.ports.length} open ports detected.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 pb-1">
      <span className="text-muted-foreground uppercase text-[10px]">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}

function RadarSweep({ active, hosts }: { active: boolean; hosts: number }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <radialGradient id="rgrad">
          <stop offset="0%" stopColor="hsl(155 100% 50%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(155 100% 50%)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sweep" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="hsl(155 100% 50%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(155 100% 50%)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#rgrad)" stroke="hsl(155 100% 50% / 0.4)" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="hsl(155 100% 50% / 0.3)" />
      <circle cx="100" cy="100" r="35" fill="none" stroke="hsl(155 100% 50% / 0.3)" />
      <line x1="5" y1="100" x2="195" y2="100" stroke="hsl(155 100% 50% / 0.2)" />
      <line x1="100" y1="5" x2="100" y2="195" stroke="hsl(155 100% 50% / 0.2)" />
      {active && (
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <path d="M100 100 L195 100 A95 95 0 0 0 167 33 Z" fill="url(#sweep)" />
        </motion.g>
      )}
      {/* Static blips when complete */}
      {!active && hosts > 0 &&
        Array.from({ length: hosts }).map((_, i) => {
          const angle = (i / hosts) * Math.PI * 2;
          const r = 30 + Math.random() * 60;
          const x = 100 + Math.cos(angle) * r;
          const y = 100 + Math.sin(angle) * r;
          return <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(155 100% 50%)" className="pulse-green" />;
        })}
      <text x="100" y="100" textAnchor="middle" className="font-mono fill-primary" fontSize="9">
        {active ? "SCANNING..." : `${hosts} HOSTS`}
      </text>
    </svg>
  );
}
