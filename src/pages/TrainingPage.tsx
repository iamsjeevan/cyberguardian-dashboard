import { Panel } from "@/components/dashboard/Panel";
import { useTrainingHistory, useTrainingStatus, useStartTraining, useStopTraining } from "@/hooks/useApiData";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAppStore } from "@/stores/appStore";
import { Play, Square } from "lucide-react";

export default function TrainingPage() {
  const { isTraining, setIsTraining } = useAppStore();
  const { data: training } = useTrainingStatus();
  const { data: history } = useTrainingHistory();
  const startMutation = useStartTraining();
  const stopMutation = useStopTraining();

  const step = training?.step ?? 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Configuration" className="col-span-3" delay={0}>
          <div className="space-y-4 text-xs">
            <SliderField label="Total Timesteps" value="2,000,000" />
            <SliderField label="CVaR α" value="0.05" />
            <SliderField label="λ EWC" value="5000" />
            <SliderField label="N Environments" value="8" />
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setIsTraining(true); startMutation.mutate(); }} disabled={isTraining}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded bg-primary/20 text-primary border border-primary/30 font-mono uppercase text-[10px] disabled:opacity-30">
                <Play size={10} /> START
              </button>
              <button onClick={() => { setIsTraining(false); stopMutation.mutate(); }} disabled={!isTraining}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded bg-destructive/20 text-destructive border border-destructive/30 font-mono uppercase text-[10px] disabled:opacity-30">
                <Square size={10} /> STOP
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="Reward Curve" className="col-span-6" live delay={1} glow>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={history ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0d3a5c" />
              <XAxis dataKey="step" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`}
                tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <YAxis tick={{ fontSize: 10, fill: "#3d7a9e", fontFamily: "JetBrains Mono" }} stroke="#0d3a5c" />
              <Tooltip contentStyle={{ background: "#041225", border: "1px solid #0d3a5c", fontFamily: "JetBrains Mono", fontSize: 11 }} />
              <Line type="monotone" dataKey="mean_reward" stroke="#00d4ff" strokeWidth={2} dot={false} name="Mean Reward" />
              <Line type="monotone" dataKey="cvar_005" stroke="#ffaa00" strokeWidth={1.5} strokeDasharray="4 2" dot={false} name="CVaR" />
              <Line type="monotone" dataKey="loss" stroke="#ff3366" strokeWidth={1} dot={false} name="Loss" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Live Log" className="col-span-3" live delay={2}>
          <div className="bg-background rounded p-2 h-[350px] overflow-y-auto font-mono text-[10px] text-muted-foreground space-y-0.5">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-primary/50">[{(step - 30 + i).toLocaleString()}]</span>
                <span>reward={( -5 + (i/30)*20 + Math.random()*2).toFixed(2)} loss={( 0.01 + Math.random()*0.005).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function SliderField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-muted-foreground font-mono">{label}</span>
        <span className="text-foreground font-mono">{value}</span>
      </div>
      <div className="h-1 bg-surface-elevated rounded-full">
        <div className="h-full w-3/4 bg-primary/40 rounded-full" />
      </div>
    </div>
  );
}
