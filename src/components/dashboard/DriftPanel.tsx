import { mockDrift, mockDriftHistory } from "@/lib/mock-data";
import { LineChart, Line, ResponsiveContainer, ReferenceLine } from "recharts";
import CountUp from "react-countup";

export function DriftPanel() {
  const d = mockDrift;
  const isStable = d.status === "STABLE";

  return (
    <div className="space-y-3">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-2xl font-bold ${isStable ? "text-secondary" : "text-destructive"} glow-text`}>
          <CountUp end={d.wasserstein_distance} decimals={3} duration={1.5} />
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">W₁ DISTANCE</span>
      </div>

      <div className={`status-badge inline-block ${isStable ? "bg-secondary/20 text-secondary" : "bg-destructive/20 text-destructive pulse-red"}`}>
        {isStable ? "● STABLE" : "⚠ DRIFT DETECTED"}
      </div>

      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockDriftHistory.slice(-30)}>
            <Line type="monotone" dataKey="distance" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
            <ReferenceLine y={0.15} stroke="#ff3366" strokeDasharray="3 3" strokeWidth={1} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
        <span>THRESHOLD: 0.150</span>
        <span>STEP: {d.step.toLocaleString()}</span>
      </div>
    </div>
  );
}
