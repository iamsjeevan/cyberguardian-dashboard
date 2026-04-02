const API_URL = "http://localhost:8000";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

export const api = {
  health: () => apiFetch<{ status: string }>("/health"),
  training: {
    status: () => apiFetch<TrainingStatus>("/training/status"),
    start: () => apiFetch("/training/start", { method: "POST" }),
    stop: () => apiFetch("/training/stop", { method: "DELETE" }),
  },
  network: {
    topology: () => apiFetch<NetworkTopology>("/network/topology"),
  },
  cvar: {
    metrics: () => apiFetch<CVaRMetrics>("/cvar/metrics"),
    alpha: () => apiFetch<AlphaSensitivity[]>("/cvar/alpha"),
    distribution: () => apiFetch<number[]>("/cvar/distribution"),
  },
  drift: {
    current: () => apiFetch<DriftStatus>("/drift/current"),
    history: () => apiFetch<DriftPoint[]>("/drift/history"),
    events: () => apiFetch<DriftEvent[]>("/drift/events"),
  },
  kg: {
    graph: () => apiFetch<KGGraph>("/kg/graph"),
    cve: (id: string) => apiFetch<CVEDetail>(`/kg/cve/${id}`),
  },
  game: {
    belief: () => apiFetch<BeliefState>("/game/belief"),
    nash: () => apiFetch<NashResult>("/game/nash"),
    predictions: () => apiFetch<AttackerPrediction[]>("/game/predictions"),
  },
  alerts: {
    list: () => apiFetch<Alert[]>("/alerts"),
    acknowledge: (id: string) => apiFetch(`/alerts/${id}`, { method: "PATCH" }),
  },
  evaluation: {
    benchmark: () => apiFetch<BenchmarkResult[]>("/evaluation/benchmark"),
    run: () => apiFetch("/evaluation/run", { method: "POST" }),
  },
  explain: {
    generate: (data: ExplainRequest) => apiFetch<ExplanationCard>("/explain/action", { method: "POST", body: JSON.stringify(data) }),
    history: () => apiFetch<ExplanationCard[]>("/explain/history"),
  },
  incidents: {
    list: () => apiFetch<Incident[]>("/incidents"),
    create: (data: Partial<Incident>) => apiFetch<Incident>("/incidents", { method: "POST", body: JSON.stringify(data) }),
    markdown: (id: string) => apiFetch<{ markdown: string }>(`/incidents/${id}/markdown`),
  },
  override: {
    action: (data: OverrideAction) => apiFetch("/override/action", { method: "POST", body: JSON.stringify(data) }),
  },
};

// Types
export interface TrainingStatus {
  step: number;
  mean_reward: number;
  cvar_005: number;
  loss: number;
  elapsed: number;
}

export interface Host {
  name: string;
  subnet: string;
  status: "CLEAN" | "COMPROMISED" | "ISOLATED" | "DECOY" | "RESTORED";
  malicious_processes: string[];
  privileged_sessions: string[];
}

export interface NetworkTopology {
  hosts: Host[];
}

export interface CVaRMetrics {
  cvar_005: number;
  var_005: number;
  mean_reward: number;
  catastrophic_rate: number;
  success_rate: number;
}

export interface AlphaSensitivity {
  alpha: number;
  cvar: number;
  interpretation: string;
}

export interface DriftStatus {
  wasserstein_distance: number;
  threshold: number;
  status: string;
  step: number;
}

export interface DriftPoint {
  step: number;
  distance: number;
  is_drift: boolean;
}

export interface DriftEvent {
  step: number;
  distance: number;
  threshold: number;
  timestamp: string;
}

export interface KGGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}

export interface KGNode {
  id: string;
  label: string;
  type: "CVE" | "Technique" | "Tactic" | "Host";
}

export interface KGEdge {
  source: string;
  target: string;
  relation: string;
}

export interface CVEDetail {
  id: string;
  description: string;
  cvss: number;
  severity: string;
  techniques: string[];
}

export interface BeliefState {
  Random: number;
  TargetedAPT: number;
  Adaptive: number;
}

export interface NashResult {
  recommended_actions: string[];
  equilibrium_value: number;
  strategy_mix: Record<string, number>;
}

export interface AttackerPrediction {
  action: string;
  probability: number;
}

export interface Alert {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  host: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface BenchmarkResult {
  agent: string;
  mean_reward: number;
  cvar_005: number;
  success_rate: number;
  catastrophic_rate: number;
  is_ours?: boolean;
}

export interface ExplanationCard {
  action: string;
  step: number;
  threat: string;
  obs_decoded: string;
  risk_score: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  why: string;
  risk_mitigated: string;
  follow_up: string;
  cve_ids: string[];
  mitre_techniques: string[];
}

export interface ExplainRequest {
  action: string;
  step: number;
  threat: string;
  obs_decoded: string;
  risk_score: number;
}

export interface Incident {
  id: string;
  severity: string;
  host: string;
  timestamp: string;
  status: string;
  message: string;
}

export interface OverrideAction {
  action: string;
  host: string;
}
