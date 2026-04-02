import { Panel } from "@/components/dashboard/Panel";
import { mockBenchmarks } from "@/lib/mock-data";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { FlaskConical } from "lucide-react";

export default function EvaluationPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm text-muted-foreground tracking-widest uppercase">Benchmark Results</h2>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-primary/30 bg-primary/20 text-primary font-mono text-xs uppercase">
          <FlaskConical size={12} /> Run Evaluation Suite
        </button>
      </div>

      <Panel title="5-Agent Benchmark Comparison" glow delay={0}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-mono text-muted-foreground font-normal">AGENT</th>
                <th className="text-right py-2 px-3 font-mono text-muted-foreground font-normal">MEAN REWARD</th>
                <th className="text-right py-2 px-3 font-mono text-muted-foreground font-normal">CVaR α=0.05</th>
                <th className="text-right py-2 px-3 font-mono text-muted-foreground font-normal">SUCCESS RATE</th>
                <th className="text-right py-2 px-3 font-mono text-muted-foreground font-normal">CATASTROPHIC</th>
              </tr>
            </thead>
            <tbody>
              {mockBenchmarks.map((b, i) => (
                <motion.tr
                  key={b.agent}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`border-b border-border/50 ${b.is_ours ? "bg-primary/5 border-l-2 border-l-warning" : ""}`}
                >
                  <td className="py-2.5 px-3 font-mono text-foreground flex items-center gap-2">
                    {b.is_ours && <span className="status-badge bg-warning/20 text-warning">★ OURS</span>}
                    {b.agent}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={b.is_ours ? "text-primary font-bold" : "text-foreground"}>
                      <CountUp end={b.mean_reward} decimals={1} duration={1.5} />
                    </span>
                    <Bar value={b.mean_reward} max={15} color={b.is_ours ? "#00d4ff" : "#3d7a9e"} />
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={b.is_ours ? "text-warning font-bold" : "text-foreground"}>
                      <CountUp end={b.cvar_005} decimals={2} duration={1.5} />
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={b.is_ours ? "text-secondary font-bold" : "text-foreground"}>
                      <CountUp end={b.success_rate * 100} decimals={1} duration={1.5} suffix="%" />
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <span className={b.catastrophic_rate > 0.05 ? "text-destructive" : "text-foreground"}>
                      <CountUp end={b.catastrophic_rate * 100} decimals={1} duration={1.5} suffix="%" />
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Research highlight cards */}
      <div className="grid grid-cols-3 gap-4">
        <Panel title="EWC Forgetting Reduction" delay={1} glow>
          <div className="text-center py-4">
            <span className="font-mono text-4xl font-bold text-primary glow-text">
              <CountUp end={881} duration={2} suffix="×" />
            </span>
            <p className="text-xs text-muted-foreground mt-2">vs standard fine-tuning</p>
          </div>
        </Panel>
        <Panel title="CVaR Improvement" delay={2} glow>
          <div className="text-center py-4">
            <span className="font-mono text-4xl font-bold text-warning glow-text">-2.14</span>
            <p className="text-xs text-muted-foreground mt-2">Ours vs -6.97 (PPO)</p>
          </div>
        </Panel>
        <Panel title="Catastrophic Failure Reduction" delay={3} glow>
          <div className="text-center py-4">
            <span className="font-mono text-4xl font-bold text-secondary glow-text">
              <CountUp end={75} duration={2} suffix="%" />
            </span>
            <p className="text-xs text-muted-foreground mt-2">2.1% vs 8.4% baseline</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const width = Math.max(0, (value / max) * 100);
  return (
    <div className="h-1 bg-surface-elevated rounded-full mt-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: color }} />
    </div>
  );
}
