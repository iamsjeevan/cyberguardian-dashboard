import { Panel } from "@/components/dashboard/Panel";
import { BeliefPanel } from "@/components/dashboard/BeliefPanel";
import { useGameBelief, useGameNash } from "@/hooks/useApiData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function GamePage() {
  const { data: belief } = useGameBelief();
  const { data: nash } = useGameNash();

  const strategyData = nash
    ? Object.entries(nash.strategy_mix).map(([action, prob]) => ({ action, prob }))
    : [];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <Panel title="Bayesian Belief State" live glow delay={0}>
          <BeliefPanel />
        </Panel>

        <Panel title="Attacker Profiles" delay={1}>
          <div className="space-y-3">
            <AttackerCard name="Random" prob={belief?.Random ?? 0} color="#3d7a9e"
              desc="Uniform action selection, opportunistic spread. Low sophistication." />
            <AttackerCard name="TargetedAPT" prob={belief?.TargetedAPT ?? 0} color="#ff3366"
              desc="Follows User→Enterprise→Op_Server0. Recognises decoys (40% detection rate)." />
            <AttackerCard name="Adaptive" prob={belief?.Adaptive ?? 0} color="#ffaa00"
              desc="Observes defender action frequency, counter-selects strategy in real-time." />
          </div>
        </Panel>
      </div>

      <div className="space-y-4">
        <Panel title="Nash Equilibrium - Recommended Strategy" glow delay={2}>
          <div className="mb-4 text-center">
            <span className="font-mono text-xs text-muted-foreground">EQUILIBRIUM VALUE</span>
            <div className="font-mono text-3xl font-bold text-primary glow-text mt-1">
              {nash?.equilibrium_value?.toFixed(2) ?? "—"}
            </div>
          </div>
          {strategyData.length > 0 && (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={strategyData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
                <YAxis type="category" dataKey="action" tick={{ fontSize: 10, fill: "#7ab3d4", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" width={60} />
                <Tooltip contentStyle={{ background: "#041225", border: "1px solid #0d3a5c", fontFamily: "JetBrains Mono", fontSize: 11 }} />
                <Bar dataKey="prob" name="Probability" radius={[0, 4, 4, 0]}>
                  {strategyData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? "#00d4ff" : "#0d3a5c"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Nash Recommendation" delay={3}>
          <button className="w-full px-3 py-2 rounded border border-primary/30 bg-primary/20 text-primary font-mono text-xs uppercase hover:bg-primary/30 transition-colors">
            Get Nash Recommendation
          </button>
          {nash && (
            <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded">
              <p className="font-mono text-xs text-primary">RECOMMENDED ACTIONS:</p>
              <p className="text-xs text-foreground/80 mt-1">{nash.recommended_actions.join(", ")}</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function AttackerCard({ name, prob, color, desc }: { name: string; prob: number; color: string; desc: string }) {
  return (
    <div className="p-2.5 rounded border border-border bg-surface-elevated">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-xs font-semibold" style={{ color }}>{name}</span>
        <span className="font-mono text-xs text-muted-foreground">{(prob * 100).toFixed(1)}%</span>
      </div>
      <p className="text-[10px] text-muted-foreground">{desc}</p>
    </div>
  );
}
