import { Panel } from "@/components/dashboard/Panel";
import { useGANHistory, useGANSamples, useGANStatus, useTrainGAN } from "@/hooks/useApiData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Play, Sparkles, ShieldAlert, ShieldCheck } from "lucide-react";

export default function GANPage() {
  const { data: status } = useGANStatus();
  const { data: history } = useGANHistory();
  const { data: samples } = useGANSamples();
  const trainMutation = useTrainGAN();

  return (
    <div className="space-y-4">
      {/* Top stats */}
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Generator" className="col-span-3" delay={0} glow>
          <div className="space-y-1">
            <div className="font-mono text-3xl text-primary glow-text">
              {status?.generator_loss.toFixed(3) ?? "—"}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">G-Loss · synthesizing adversarial samples</p>
          </div>
        </Panel>

        <Panel title="Discriminator" className="col-span-3" delay={1} glow>
          <div className="space-y-1">
            <div className="font-mono text-3xl text-secondary glow-text">
              {status?.discriminator_loss.toFixed(3) ?? "—"}
            </div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">D-Loss · classifying real vs fake</p>
          </div>
        </Panel>

        <Panel title="FID Score" className="col-span-2" delay={2}>
          <div className="space-y-1">
            <div className="font-mono text-3xl text-foreground">{status?.fid_score.toFixed(2) ?? "—"}</div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Fréchet distance</p>
          </div>
        </Panel>

        <Panel title="Realism" className="col-span-2" delay={3}>
          <div className="space-y-1">
            <div className="font-mono text-3xl text-primary">{((status?.realism_score ?? 0) * 100).toFixed(1)}%</div>
            <p className="text-[10px] text-muted-foreground font-mono uppercase">Sample fidelity</p>
          </div>
        </Panel>

        <Panel title="Control" className="col-span-2" delay={4}>
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-muted-foreground">EPOCH {status?.epoch ?? 0} · {status?.mode ?? "IDLE"}</div>
            <button
              onClick={() => trainMutation.mutate()}
              className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded bg-primary/20 text-primary border border-primary/30 font-mono uppercase text-[10px]"
            >
              <Play size={10} /> TRAIN GAN
            </button>
          </div>
        </Panel>
      </div>

      {/* Loss curves + samples */}
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Adversarial Loss Curves — G vs D" className="col-span-8" live delay={5} glow>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={history ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d3a5c" />
              <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <YAxis tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <Tooltip contentStyle={{ background: "#041225", border: "1px solid #0d3a5c", fontFamily: "JetBrains Mono", fontSize: 11 }} />
              <Legend wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: 10 }} />
              <Line type="monotone" dataKey="generator_loss" stroke="#00d4ff" strokeWidth={2} dot={false} name="Generator" />
              <Line type="monotone" dataKey="discriminator_loss" stroke="#00ff9d" strokeWidth={2} dot={false} name="Discriminator" />
              <Line type="monotone" dataKey="fid" stroke="#ffaa00" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="FID" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Synthetic Samples" className="col-span-4" live delay={6}>
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {(samples ?? []).map((s) => (
              <div key={s.id} className="border border-border rounded p-2 bg-surface-elevated/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary">{s.type}</span>
                  {s.detected_by_discriminator ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-clean"><ShieldCheck size={10} /> CAUGHT</span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-mono text-destructive"><ShieldAlert size={10} /> EVADED</span>
                  )}
                </div>
                <div className="font-mono text-[9px] text-muted-foreground mt-1 truncate">{s.signature}</div>
                <div className="mt-1 h-1 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary/60" style={{ width: `${s.realism * 100}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-0.5">
                  <span>realism</span>
                  <span>{(s.realism * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Info panel */}
      <Panel title="GAN Role in ACD Pipeline" className="col-span-12" delay={7}>
        <div className="grid grid-cols-3 gap-4 text-xs font-mono text-muted-foreground">
          <div>
            <div className="text-primary mb-1 flex items-center gap-1"><Sparkles size={12} /> Generator (G)</div>
            Synthesizes novel adversarial traffic / payload variants to expand the training distribution and harden the CVaR-PPO defender.
          </div>
          <div>
            <div className="text-secondary mb-1 flex items-center gap-1"><ShieldCheck size={12} /> Discriminator (D)</div>
            Classifies real network telemetry vs. synthetic samples — its rejection rate is fed back as a robustness signal.
          </div>
          <div>
            <div className="text-foreground mb-1 flex items-center gap-1"><ShieldAlert size={12} /> Defense Output</div>
            Evaded samples become high-priority training exemplars, reducing catastrophic failure modes and boosting drift resilience.
          </div>
        </div>
      </Panel>
    </div>
  );
}
