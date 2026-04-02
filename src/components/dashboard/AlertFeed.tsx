import { useAppStore } from "@/stores/appStore";
import { motion } from "framer-motion";

const severityStyle: Record<string, string> = {
  CRITICAL: "bg-destructive/20 text-destructive",
  HIGH: "bg-warning/20 text-warning",
  MEDIUM: "bg-primary/20 text-primary",
  LOW: "bg-muted text-muted-foreground",
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export function AlertFeed() {
  const { alerts, acknowledgeAlert } = useAppStore();
  const unacked = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <span className="status-badge bg-destructive/20 text-destructive">{unacked} UNACKNOWLEDGED</span>
      </div>
      <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`p-2 rounded border text-xs ${
              alert.severity === "CRITICAL" && !alert.acknowledged
                ? "border-destructive/50 bg-destructive/5"
                : "border-border bg-surface-elevated"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`status-badge ${severityStyle[alert.severity]}`}>{alert.severity}</span>
              <span className="font-mono text-muted-foreground">{alert.host}</span>
              <span className="ml-auto text-muted-foreground font-mono">{timeAgo(alert.timestamp)}</span>
            </div>
            <p className="text-foreground/80">{alert.message}</p>
            {!alert.acknowledged && (
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="mt-1 text-[10px] font-mono text-primary hover:text-primary/80 transition-colors"
              >
                ACK →
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
