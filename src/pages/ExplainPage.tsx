import { Panel } from "@/components/dashboard/Panel";
import { mockExplanations } from "@/lib/mock-data";
import { motion } from "framer-motion";

const sevStyle: Record<string, string> = {
  CRITICAL: "bg-destructive/20 text-destructive",
  HIGH: "bg-warning/20 text-warning",
  MEDIUM: "bg-primary/20 text-primary",
  LOW: "bg-muted text-muted-foreground",
};

export default function ExplainPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm text-muted-foreground tracking-widest uppercase">XAI Action Explanations</h2>
        <button className="px-3 py-1.5 rounded border border-primary/30 bg-primary/20 text-primary font-mono text-xs uppercase">
          Generate Explanation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockExplanations.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="panel"
          >
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className={`status-badge ${sevStyle[card.severity]}`}>{card.severity}</span>
                <span className="font-display text-sm text-foreground">{card.action}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">Step {card.step.toLocaleString()}</span>
              </div>

              <Section color="destructive" title="Threat Detected" text={card.threat} />
              <Section color="primary" title="Why This Action" text={card.why} />
              <Section color="secondary" title="Risk Mitigated" text={card.risk_mitigated} />
              <Section color="warning" title="Recommended Follow-up" text={card.follow_up} />

              <div className="flex flex-wrap gap-1.5">
                {card.cve_ids.map(c => (
                  <span key={c} className="status-badge bg-destructive/10 text-destructive cursor-pointer hover:bg-destructive/20">{c}</span>
                ))}
                {card.mitre_techniques.map(t => (
                  <span key={t} className="status-badge bg-primary/10 text-primary">{t}</span>
                ))}
              </div>

              <div className="font-mono text-[9px] text-muted-foreground">
                Risk Score: {(card.risk_score * 100).toFixed(0)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Section({ color, title, text }: { color: string; title: string; text: string }) {
  return (
    <div className={`p-2 rounded bg-${color}/5 border-l-2 border-${color}/30`}>
      <span className={`font-mono text-[10px] text-${color} uppercase block mb-0.5`}>{title}</span>
      <p className="text-xs text-foreground/80">{text}</p>
    </div>
  );
}
