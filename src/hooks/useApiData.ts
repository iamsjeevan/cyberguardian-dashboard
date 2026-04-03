import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type {
  TrainingStatus, Host, CVaRMetrics, AlphaSensitivity, DriftStatus, DriftPoint, DriftEvent,
  KGGraph, CVEDetail, BeliefState, NashResult, AttackerPrediction, Alert, BenchmarkResult,
  ExplanationCard, ExplainRequest, Incident, OverrideAction,
} from "@/lib/api/client";
import {
  mockHosts, mockAlerts, mockTrainingStatus, mockCVaRMetrics, mockDrift, mockBelief,
  mockBenchmarks, mockExplanations, mockDriftHistory, mockTrainingHistory,
} from "@/lib/mock-data";

/** Try API first, fall back to mock data on failure */
async function withFallback<T>(apiFn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await apiFn();
  } catch {
    console.warn("[ACD] API unavailable, using mock data");
    return fallback;
  }
}

// ─── Health ───
export const useHealth = () =>
  useQuery({ queryKey: ["health"], queryFn: () => withFallback(api.health, { status: "mock" }), refetchInterval: 10000 });

// ─── Training ───
export const useTrainingStatus = () =>
  useQuery({ queryKey: ["training", "status"], queryFn: () => withFallback(api.training.status, mockTrainingStatus), refetchInterval: 5000 });

export const useStartTraining = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.training.start(), onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }) });
};

export const useStopTraining = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.training.stop(), onSuccess: () => qc.invalidateQueries({ queryKey: ["training"] }) });
};

// ─── Network ───
export const useNetworkTopology = () =>
  useQuery({ queryKey: ["network", "topology"], queryFn: () => withFallback(api.network.topology, { hosts: mockHosts }), refetchInterval: 5000 });

// ─── CVaR ───
export const useCVaRMetrics = () =>
  useQuery({ queryKey: ["cvar", "metrics"], queryFn: () => withFallback(api.cvar.metrics, mockCVaRMetrics), refetchInterval: 10000 });

export const useCVaRAlpha = () =>
  useQuery({
    queryKey: ["cvar", "alpha"],
    queryFn: () => withFallback<AlphaSensitivity[]>(api.cvar.alpha, [
      { alpha: 0.01, cvar: -4.2, interpretation: "Extreme tail risk" },
      { alpha: 0.05, cvar: -2.14, interpretation: "Standard risk measure" },
      { alpha: 0.10, cvar: -1.1, interpretation: "Moderate risk" },
      { alpha: 0.50, cvar: 0.8, interpretation: "Median performance" },
    ]),
  });

export const useCVaRDistribution = () =>
  useQuery({
    queryKey: ["cvar", "distribution"],
    queryFn: () => withFallback<number[]>(api.cvar.distribution, Array.from({ length: 100 }, () => Math.random() * 20 - 5)),
  });

// ─── Drift ───
export const useDriftCurrent = () =>
  useQuery({ queryKey: ["drift", "current"], queryFn: () => withFallback(api.drift.current, mockDrift), refetchInterval: 5000 });

export const useDriftHistory = () =>
  useQuery({ queryKey: ["drift", "history"], queryFn: () => withFallback<DriftPoint[]>(api.drift.history, mockDriftHistory) });

export const useDriftEvents = () =>
  useQuery({
    queryKey: ["drift", "events"],
    queryFn: () => withFallback<DriftEvent[]>(api.drift.events, []),
  });

// ─── Knowledge Graph ───
export const useKGGraph = () =>
  useQuery({
    queryKey: ["kg", "graph"],
    queryFn: () => withFallback<KGGraph>(api.kg.graph, {
      nodes: [
        { id: "CVE-2024-1234", label: "CVE-2024-1234", type: "CVE" },
        { id: "CVE-2023-5678", label: "CVE-2023-5678", type: "CVE" },
        { id: "CVE-2024-5678", label: "CVE-2024-5678", type: "CVE" },
        { id: "T1059", label: "Command & Scripting", type: "Technique" },
        { id: "T1190", label: "Exploit Public App", type: "Technique" },
        { id: "T1021", label: "Remote Services", type: "Technique" },
        { id: "T1595", label: "Active Scanning", type: "Technique" },
        { id: "T1046", label: "Network Scanning", type: "Technique" },
        { id: "TA0001", label: "Initial Access", type: "Tactic" },
        { id: "TA0002", label: "Execution", type: "Tactic" },
        { id: "User1", label: "User1", type: "Host" },
        { id: "Enterprise0", label: "Enterprise0", type: "Host" },
      ],
      edges: [
        { source: "CVE-2024-1234", target: "T1190", relation: "MAPS_TO" },
        { source: "CVE-2024-1234", target: "T1059", relation: "MAPS_TO" },
        { source: "CVE-2023-5678", target: "T1021", relation: "MAPS_TO" },
        { source: "CVE-2024-5678", target: "T1595", relation: "MAPS_TO" },
        { source: "T1190", target: "TA0001", relation: "BELONGS_TO" },
        { source: "T1059", target: "TA0002", relation: "BELONGS_TO" },
        { source: "CVE-2024-1234", target: "User1", relation: "AFFECTS" },
        { source: "CVE-2024-5678", target: "Enterprise0", relation: "AFFECTS" },
      ],
    }),
  });

export const useKGCve = (id: string) =>
  useQuery({
    queryKey: ["kg", "cve", id],
    queryFn: () => withFallback<CVEDetail>(
      () => api.kg.cve(id),
      { id, description: "Mock CVE", cvss: 7.5, severity: "HIGH", techniques: ["T1190"] }
    ),
    enabled: !!id,
  });

// ─── Game Theory ───
export const useGameBelief = () =>
  useQuery({ queryKey: ["game", "belief"], queryFn: () => withFallback(api.game.belief, mockBelief), refetchInterval: 5000 });

export const useGameNash = () =>
  useQuery({
    queryKey: ["game", "nash"],
    queryFn: () => withFallback<NashResult>(api.game.nash, {
      recommended_actions: ["Deploy Decoy on Enterprise0", "Isolate User1"],
      equilibrium_value: 12.47,
      strategy_mix: { Isolate: 0.35, Decoy: 0.28, Restore: 0.15, Monitor: 0.12, Block: 0.10 },
    }),
  });

export const useGamePredictions = () =>
  useQuery({
    queryKey: ["game", "predictions"],
    queryFn: () => withFallback<AttackerPrediction[]>(api.game.predictions, [
      { action: "Exploit User1", probability: 0.42 },
      { action: "Lateral Move to Enterprise0", probability: 0.31 },
      { action: "Privilege Escalation", probability: 0.27 },
    ]),
  });

// ─── Alerts ───
export const useAlerts = () =>
  useQuery({ queryKey: ["alerts"], queryFn: () => withFallback(api.alerts.list, mockAlerts), refetchInterval: 5000 });

export const useAcknowledgeAlert = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => api.alerts.acknowledge(id), onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }) });
};

// ─── Evaluation ───
export const useBenchmarks = () =>
  useQuery({ queryKey: ["evaluation", "benchmark"], queryFn: () => withFallback(api.evaluation.benchmark, mockBenchmarks) });

export const useRunEvaluation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => api.evaluation.run(), onSuccess: () => qc.invalidateQueries({ queryKey: ["evaluation"] }) });
};

// ─── Explain ───
export const useExplainHistory = () =>
  useQuery({ queryKey: ["explain", "history"], queryFn: () => withFallback(api.explain.history, mockExplanations) });

export const useGenerateExplanation = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: ExplainRequest) => api.explain.generate(data), onSuccess: () => qc.invalidateQueries({ queryKey: ["explain"] }) });
};

// ─── Incidents ───
const mockIncidents: Incident[] = [
  { id: "INC-001", severity: "CRITICAL", host: "User1", timestamp: "2026-04-02T10:23:00Z", status: "OPEN", message: "Active reverse shell detected, privilege escalation confirmed" },
  { id: "INC-002", severity: "HIGH", host: "User3", timestamp: "2026-04-02T09:45:00Z", status: "INVESTIGATING", message: "Lateral movement via SMB from User3 to Enterprise0" },
  { id: "INC-003", severity: "MEDIUM", host: "Enterprise0", timestamp: "2026-04-02T08:12:00Z", status: "RESOLVED", message: "Decoy engagement — attacker probing Enterprise0 honeypot" },
];

export const useIncidents = () =>
  useQuery({ queryKey: ["incidents"], queryFn: () => withFallback(api.incidents.list, mockIncidents) });

export const useCreateIncident = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (data: Partial<Incident>) => api.incidents.create(data), onSuccess: () => qc.invalidateQueries({ queryKey: ["incidents"] }) });
};

export const useIncidentMarkdown = (id: string) =>
  useQuery({
    queryKey: ["incidents", id, "markdown"],
    queryFn: () => withFallback(() => api.incidents.markdown(id), { markdown: "# Incident Report\n\nAutomated response initiated. Host isolated. Forensic snapshot captured." }),
    enabled: !!id,
  });

// ─── Override ───
export const useOverrideAction = () =>
  useMutation({ mutationFn: (data: OverrideAction) => api.override.action(data) });

// ─── Training History (mock only, no dedicated endpoint) ───
export const useTrainingHistory = () =>
  useQuery({ queryKey: ["training", "history"], queryFn: async () => mockTrainingHistory, staleTime: Infinity });
