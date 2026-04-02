import { mockCVaRMetrics } from "@/lib/mock-data";
import CountUp from "react-countup";

export function CVaRPanel() {
  const m = mockCVaRMetrics;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-2xl font-bold text-warning glow-text">
          <CountUp end={m.cvar_005} decimals={2} duration={1.5} prefix="" />
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">CVaR α=0.05</span>
      </div>
      
      <div className="flex gap-2">
        <div className="status-badge bg-destructive/20 text-destructive">
          <CountUp end={m.catastrophic_rate * 100} decimals={1} duration={1} suffix="%" /> CATASTROPHIC
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-surface-elevated rounded p-2">
          <span className="text-muted-foreground block">VaR 0.05</span>
          <span className="font-mono text-foreground">{m.var_005.toFixed(2)}</span>
        </div>
        <div className="bg-surface-elevated rounded p-2">
          <span className="text-muted-foreground block">Mean Reward</span>
          <span className="font-mono text-primary">{m.mean_reward.toFixed(1)}</span>
        </div>
      </div>

      <select className="w-full bg-surface-elevated border border-border rounded px-2 py-1 text-xs font-mono text-foreground">
        <option>α = 0.05</option>
        <option>α = 0.01</option>
        <option>α = 0.10</option>
        <option>α = 0.50</option>
      </select>
    </div>
  );
}
