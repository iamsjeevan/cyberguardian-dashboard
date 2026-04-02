import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockTrainingHistory } from "@/lib/mock-data";

export function TrainingChart() {
  const data = mockTrainingHistory.slice(-100);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#0d3a5c" />
        <XAxis 
          dataKey="step" 
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
          tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }}
          stroke="#0d3a5c"
        />
        <YAxis 
          yAxisId="reward"
          tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }}
          stroke="#0d3a5c"
        />
        <YAxis 
          yAxisId="cvar"
          orientation="right"
          tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }}
          stroke="#0d3a5c"
        />
        <Tooltip
          contentStyle={{ background: "#041225", border: "1px solid #0d3a5c", fontFamily: "JetBrains Mono", fontSize: 11 }}
          labelFormatter={(v) => `Step ${v}`}
        />
        <Line yAxisId="reward" type="monotone" dataKey="mean_reward" stroke="#00d4ff" strokeWidth={2} dot={false} name="Mean Reward" />
        <Line yAxisId="cvar" type="monotone" dataKey="cvar_005" stroke="#ffaa00" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="CVaR α=0.05" />
      </LineChart>
    </ResponsiveContainer>
  );
}
