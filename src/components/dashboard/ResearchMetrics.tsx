import { motion } from "framer-motion";
import CountUp from "react-countup";

const metrics = [
  { label: "EWC Forgetting Reduction", value: 881, suffix: "×", color: "border-primary/40", textColor: "text-primary" },
  { label: "Fewer Catastrophic Failures", value: 75, suffix: "%", color: "border-secondary/40", textColor: "text-secondary" },
  { label: "Success Rate", value: 87.3, suffix: "%", decimals: 1, color: "border-primary/40", textColor: "text-primary" },
  { label: "Catastrophic Rate", value: 2.1, suffix: "%", decimals: 1, color: "border-destructive/40", textColor: "text-destructive" },
];

export function ResearchMetrics() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          className={`panel panel-glow border-l-2 ${m.color} p-3 text-center`}
        >
          <span className={`font-mono text-2xl font-bold ${m.textColor} glow-text`}>
            <CountUp end={m.value} decimals={m.decimals || 0} duration={2} suffix={m.suffix} />
          </span>
          <p className="font-mono text-[9px] text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
