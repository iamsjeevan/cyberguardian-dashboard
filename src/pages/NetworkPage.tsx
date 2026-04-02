import { Panel } from "@/components/dashboard/Panel";
import { NetworkTopologyPanel } from "@/components/dashboard/NetworkTopologyPanel";
import { useAppStore } from "@/stores/appStore";

const statusStyle: Record<string, string> = {
  CLEAN: "bg-secondary/20 text-secondary",
  COMPROMISED: "bg-destructive/20 text-destructive",
  ISOLATED: "bg-warning/20 text-warning",
  DECOY: "bg-[#a855f7]/20 text-[#a855f7]",
  RESTORED: "bg-primary/20 text-primary",
};

export default function NetworkPage() {
  const { hosts, selectedHost, setSelectedHost } = useAppStore();
  const selected = hosts.find(h => h.name === selectedHost);

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-7rem)]">
      <Panel title="Network Map" className="col-span-8 h-full" live glow delay={0}>
        <div className="h-[calc(100%-1rem)]">
          <NetworkTopologyPanel />
        </div>
      </Panel>

      <div className="col-span-4 space-y-4">
        <Panel title="Host List" delay={1}>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {hosts.map(h => (
              <button key={h.name} onClick={() => setSelectedHost(h.name)}
                className={`w-full text-left p-2 rounded border text-xs font-mono transition-colors ${
                  selectedHost === h.name ? "border-primary/50 bg-primary/10" : "border-border bg-surface-elevated hover:bg-accent"
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{h.name}</span>
                  <span className={`status-badge ${statusStyle[h.status]}`}>{h.status}</span>
                </div>
                <span className="text-muted-foreground text-[10px]">{h.subnet}</span>
              </button>
            ))}
          </div>
        </Panel>

        {selected && (
          <Panel title={`Host: ${selected.name}`} delay={2} glow>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground font-mono block mb-1">STATUS</span>
                <span className={`status-badge ${statusStyle[selected.status]}`}>{selected.status}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-mono block mb-1">SUBNET</span>
                <span className="font-mono text-foreground">{selected.subnet}</span>
              </div>
              <div>
                <span className="text-muted-foreground font-mono block mb-1">MALICIOUS PROCESSES</span>
                {selected.malicious_processes.length ? (
                  selected.malicious_processes.map(p => (
                    <span key={p} className="status-badge bg-destructive/20 text-destructive mr-1 mb-1 inline-block">{p}</span>
                  ))
                ) : <span className="font-mono text-secondary">NONE</span>}
              </div>
              <div>
                <span className="text-muted-foreground font-mono block mb-1">PRIVILEGED SESSIONS</span>
                {selected.privileged_sessions.length ? (
                  selected.privileged_sessions.map(s => (
                    <span key={s} className="font-mono text-warning block">{s}</span>
                  ))
                ) : <span className="font-mono text-secondary">NONE</span>}
              </div>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
