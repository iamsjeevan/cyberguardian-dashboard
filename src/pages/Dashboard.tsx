import { Panel } from "@/components/dashboard/Panel";
import { StatusBar } from "@/components/dashboard/StatusBar";
import { NetworkTopologyPanel } from "@/components/dashboard/NetworkTopologyPanel";
import { ThreatGauge } from "@/components/dashboard/ThreatGauge";
import { TrainingChart } from "@/components/dashboard/TrainingChart";
import { CVaRPanel } from "@/components/dashboard/CVaRPanel";
import { BeliefPanel } from "@/components/dashboard/BeliefPanel";
import { AlertFeed } from "@/components/dashboard/AlertFeed";
import { DriftPanel } from "@/components/dashboard/DriftPanel";
import { ResearchMetrics } from "@/components/dashboard/ResearchMetrics";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useNetworkTopology, useAlerts, useIncidents, useHealth } from "@/hooks/useApiData";

export default function Dashboard() {
  const { data: topology } = useNetworkTopology();
  const { data: alerts } = useAlerts();
  const { data: incidents } = useIncidents();
  const { data: health } = useHealth();

  const hosts = topology?.hosts ?? [];
  const activeSessions = hosts.filter(h => h.privileged_sessions.length > 0).length;

  return (
    <div className="space-y-3">
      <StatusBar />

      <div className="grid grid-cols-12 gap-3">
        <Panel title="Network Topology" className="col-span-5 row-span-2" live delay={1} glow>
          <NetworkTopologyPanel />
        </Panel>

        <Panel title="Threat Level" className="col-span-3" delay={2}>
          <ThreatGauge />
        </Panel>

        <Panel title="Alert Feed" className="col-span-4 row-span-2" live delay={3}>
          <AlertFeed />
        </Panel>

        <Panel title="Live Training Metrics" className="col-span-3" live delay={4}>
          <TrainingChart />
        </Panel>

        <Panel title="CVaR Risk Analysis" className="col-span-4" delay={5} glow>
          <CVaRPanel />
        </Panel>

        <Panel title="Attacker Belief State" className="col-span-4" live delay={6}>
          <BeliefPanel />
        </Panel>

        <Panel title="Drift Detection" className="col-span-4" delay={7}>
          <DriftPanel />
        </Panel>
      </div>

      <ResearchMetrics />

      <div className="grid grid-cols-12 gap-3">
        <Panel title="Quick Actions" className="col-span-6" delay={9}>
          <QuickActions />
        </Panel>

        <Panel title="Active Stats" className="col-span-3" delay={10}>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <span className="font-mono text-xl font-bold text-foreground">{incidents?.length ?? 0}</span>
              <p className="font-mono text-[9px] text-muted-foreground mt-1">INCIDENTS</p>
            </div>
            <div className="text-center">
              <span className="font-mono text-xl font-bold text-foreground">{activeSessions}</span>
              <p className="font-mono text-[9px] text-muted-foreground mt-1">ACTIVE SESSIONS</p>
            </div>
          </div>
        </Panel>

        <Panel title="System Resources" className="col-span-3" delay={11}>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Status</span>
              <span className={health?.status ? "text-secondary" : "text-warning"}>
                {health?.status === "mock" ? "● MOCK" : health?.status ? "● LIVE" : "● OFFLINE"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">WS Connections</span>
              <span className="text-foreground">5/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Redis</span>
              <span className="text-secondary">● CONNECTED</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
