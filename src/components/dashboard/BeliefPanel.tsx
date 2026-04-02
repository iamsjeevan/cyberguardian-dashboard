import { useAppStore } from "@/stores/appStore";
import { motion } from "framer-motion";

const attackerInfo: Record<string, { color: string; desc: string }> = {
  Random: { color: "#3d7a9e", desc: "Uniform action selection" },
  TargetedAPT: { color: "#ff3366", desc: "User→Enterprise→Op_Server0" },
  Adaptive: { color: "#ffaa00", desc: "Counter-selects strategy" },
};

export function BeliefPanel() {
  const belief = useAppStore((s) => s.belief);
  const dominant = Object.entries(belief).sort(([, a], [, b]) => b - a)[0][0];

  return (
    <div className="space-y-3">
      {Object.entries(belief).map(([name, prob]) => {
        const info = attackerInfo[name];
        const isDominant = name === dominant;
        return (
          <div key={name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className={`font-mono ${isDominant ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                {name}
              </span>
              <span className="font-mono text-muted-foreground">{(prob * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isDominant ? "shadow-[0_0_8px_rgba(255,51,102,0.4)]" : ""}`}
                style={{ backgroundColor: info.color }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{info.desc}</p>
          </div>
        );
      })}
      <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded text-xs font-mono text-primary">
        REC: Deploy Decoy on Enterprise0
      </div>
    </div>
  );
}
