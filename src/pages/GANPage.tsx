import { Panel } from "@/components/dashboard/Panel";
import { useProcessStore } from "@/stores/processStore";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Cpu, Activity, Sparkles, ShieldCheck, ShieldAlert } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useEffect, useRef } from "react";
import noiseImg from "@/assets/gan-noise.svg";
import clearImg from "@/assets/gan-clear.svg";

export default function GANPage() {
  const {
    ganRunning, ganInitializing, ganProgress, ganEpoch, ganConfig,
    ganLoss, setGanConfig, startGan, stopGan, logs,
  } = useProcessStore();

  const consoleRef = useRef<HTMLDivElement>(null);
  const ganLogs = logs.filter((l) => l.source === "GAN").slice(0, 200);

  useEffect(() => {
    if (consoleRef.current) consoleRef.current.scrollTop = 0;
  }, [ganLogs.length]);

  const isActive = ganRunning || ganInitializing;
  const btnLabel = ganInitializing ? "Initializing..." : ganRunning ? "Stop Training" : "Train GAN";
  const btnClass = ganInitializing
    ? "bg-warning/20 text-warning border-warning/40 cursor-wait"
    : ganRunning
    ? "bg-destructive/20 text-destructive border-destructive/40 hover:bg-destructive/30 pulse-red"
    : "bg-primary/20 text-primary border-primary/40 hover:bg-primary/30";

  // Synthetic preview crossfade
  const previewSharpness = ganProgress / 100;

  return (
    <div className="space-y-4">
      {/* Top control row */}
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Mission Control" className="col-span-4" delay={0} glow>
          <div className="space-y-3">
            <button
              onClick={isActive ? stopGan : startGan}
              disabled={ganInitializing}
              className={`w-full flex items-center justify-center gap-2 px-3 py-3 rounded border font-mono uppercase text-xs tracking-wider transition-all ${btnClass}`}
            >
              {ganRunning ? <Square size={14} /> : <Play size={14} />}
              {btnLabel}
            </button>
            <div>
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                <span>PROGRESS</span>
                <span>{ganProgress.toFixed(1)}% · EPOCH {ganEpoch}/{ganConfig.epochs}</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  animate={{ width: `${ganProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">
              STATUS:{" "}
              <span className={isActive ? "text-primary glow-text" : "text-muted-foreground"}>
                {ganInitializing ? "INITIALIZING" : ganRunning ? "TRAINING" : ganProgress >= 100 ? "COMPLETE" : "IDLE"}
              </span>
            </div>
          </div>
        </Panel>

        <Panel title="Model Configuration" className="col-span-4" delay={1}>
          <div className="space-y-3">
            <ConfigField
              label="Learning Rate"
              value={ganConfig.learningRate}
              step={0.00005}
              min={0.00001}
              max={0.01}
              disabled={isActive}
              onChange={(v) => setGanConfig({ learningRate: v })}
            />
            <ConfigField
              label="Epochs"
              value={ganConfig.epochs}
              step={1}
              min={5}
              max={500}
              disabled={isActive}
              onChange={(v) => setGanConfig({ epochs: Math.round(v) })}
            />
            <ConfigField
              label="Batch Size"
              value={ganConfig.batchSize}
              step={8}
              min={8}
              max={512}
              disabled={isActive}
              onChange={(v) => setGanConfig({ batchSize: Math.round(v) })}
            />
          </div>
        </Panel>

        <Panel title="Generated Preview" className="col-span-4" delay={2} glow>
          <div className="relative aspect-square w-full rounded overflow-hidden border border-border bg-background">
            <img src={noiseImg} alt="noise" className="absolute inset-0 w-full h-full object-cover" />
            <motion.img
              src={clearImg}
              alt="generated"
              className="absolute inset-0 w-full h-full object-cover"
              animate={{ opacity: previewSharpness, filter: `blur(${(1 - previewSharpness) * 20}px)` }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute bottom-1 left-2 right-2 flex justify-between font-mono text-[9px] text-primary glow-text">
              <span>G(z) · 128×128</span>
              <span>FIDELITY {(previewSharpness * 100).toFixed(0)}%</span>
            </div>
          </div>
        </Panel>
      </div>

      {/* Loss/accuracy chart + console */}
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Live Training Metrics — Loss vs Accuracy" className="col-span-7" live={ganRunning} delay={3} glow>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ganLoss}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d3a5c" />
              <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <Tooltip contentStyle={{ background: "#041225", border: "1px solid #0d3a5c", fontFamily: "JetBrains Mono", fontSize: 11 }} />
              <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }} />
              <Line yAxisId="left" type="monotone" dataKey="loss" stroke="#ff3366" strokeWidth={2} dot={false} name="Loss" isAnimationActive={false} />
              <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="#00ff9d" strokeWidth={2} dot={false} name="Accuracy %" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Real-time Training Output" className="col-span-5" live={ganRunning} delay={4}>
          <div
            ref={consoleRef}
            className="h-[300px] overflow-y-auto bg-background/80 border border-border rounded p-2 font-mono text-[10px] space-y-0.5"
          >
            <AnimatePresence initial={false}>
              {ganLogs.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <span className="text-muted-foreground shrink-0">
                    {new Date(l.ts).toLocaleTimeString("en-GB", { hour12: false })}
                  </span>
                  <span className={
                    l.level === "OK" ? "text-secondary" :
                    l.level === "WARN" ? "text-warning" :
                    l.level === "ERROR" ? "text-destructive" : "text-primary"
                  }>›</span>
                  <span className="text-foreground/80 truncate">{l.message}</span>
                </motion.div>
              ))}
              {!ganLogs.length && (
                <div className="text-muted-foreground">AWAITING DATA...</div>
              )}
            </AnimatePresence>
          </div>
        </Panel>
      </div>

      {/* Roles */}
      <Panel title="GAN Role in ACD Pipeline" delay={5}>
        <div className="grid grid-cols-3 gap-4 text-xs font-mono text-muted-foreground">
          <RoleCard icon={<Sparkles size={12} />} title="Generator (G)" color="text-primary">
            Synthesizes novel adversarial traffic / payload variants to expand the training distribution.
          </RoleCard>
          <RoleCard icon={<ShieldCheck size={12} />} title="Discriminator (D)" color="text-secondary">
            Classifies real telemetry vs. synthetic samples — its rejection rate becomes a robustness signal.
          </RoleCard>
          <RoleCard icon={<ShieldAlert size={12} />} title="Defense Output" color="text-foreground">
            Evaded samples become high-priority training exemplars, reducing catastrophic failure modes.
          </RoleCard>
        </div>
      </Panel>
    </div>
  );
}

function ConfigField({
  label, value, step, min, max, disabled, onChange,
}: {
  label: string; value: number; step: number; min: number; max: number; disabled: boolean; onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase mb-1">
        <span>{label}</span>
        <span className="text-primary">{value}</span>
      </div>
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-background border border-border rounded px-2 py-1.5 font-mono text-xs text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
      />
    </label>
  );
}

function RoleCard({ icon, title, color, children }: { icon: React.ReactNode; title: string; color: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={`${color} mb-1 flex items-center gap-1`}>{icon} {title}</div>
      {children}
    </div>
  );
}
