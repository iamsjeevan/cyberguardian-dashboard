import type { Host, Alert, TrainingStatus, CVaRMetrics, DriftStatus, BeliefState, BenchmarkResult, ExplanationCard, DriftPoint } from "./api/client";

export const mockHosts: Host[] = [
  { name: "User0", subnet: "10.0.1.0/24", status: "CLEAN", malicious_processes: [], privileged_sessions: [] },
  { name: "User1", subnet: "10.0.1.0/24", status: "COMPROMISED", malicious_processes: ["reverse_shell.py", "mimikatz.exe"], privileged_sessions: ["admin@User1"] },
  { name: "User2", subnet: "10.0.1.0/24", status: "CLEAN", malicious_processes: [], privileged_sessions: [] },
  { name: "User3", subnet: "10.0.2.0/24", status: "ISOLATED", malicious_processes: ["keylogger.dll"], privileged_sessions: [] },
  { name: "User4", subnet: "10.0.2.0/24", status: "CLEAN", malicious_processes: [], privileged_sessions: [] },
  { name: "Enterprise0", subnet: "10.0.3.0/24", status: "DECOY", malicious_processes: [], privileged_sessions: [] },
  { name: "Op_Server0", subnet: "10.0.4.0/24", status: "CLEAN", malicious_processes: [], privileged_sessions: [] },
];

export const mockAlerts: Alert[] = [
  { id: "a1", severity: "CRITICAL", host: "User1", message: "Reverse shell detected on port 4444", timestamp: new Date(Date.now() - 120000).toISOString(), acknowledged: false },
  { id: "a2", severity: "HIGH", host: "User3", message: "Lateral movement attempt via SMB", timestamp: new Date(Date.now() - 300000).toISOString(), acknowledged: false },
  { id: "a3", severity: "MEDIUM", host: "Enterprise0", message: "Decoy triggered — attacker probing", timestamp: new Date(Date.now() - 600000).toISOString(), acknowledged: true },
  { id: "a4", severity: "LOW", host: "User0", message: "Unusual outbound DNS query volume", timestamp: new Date(Date.now() - 900000).toISOString(), acknowledged: true },
  { id: "a5", severity: "HIGH", host: "User1", message: "Privilege escalation via CVE-2024-1234", timestamp: new Date(Date.now() - 45000).toISOString(), acknowledged: false },
];

export const mockTrainingStatus: TrainingStatus = {
  step: 1247832,
  mean_reward: 14.7,
  cvar_005: -2.14,
  loss: 0.0023,
  elapsed: 7243,
};

export const mockCVaRMetrics: CVaRMetrics = {
  cvar_005: -2.14,
  var_005: -3.8,
  mean_reward: 14.7,
  catastrophic_rate: 0.021,
  success_rate: 0.873,
};

export const mockDrift: DriftStatus = {
  wasserstein_distance: 0.087,
  threshold: 0.15,
  status: "STABLE",
  step: 1247832,
};

export const mockBelief: BeliefState = {
  Random: 0.12,
  TargetedAPT: 0.71,
  Adaptive: 0.17,
};

export const mockBenchmarks: BenchmarkResult[] = [
  { agent: "CVaR-PPO + EWC (Ours)", mean_reward: 14.7, cvar_005: -2.14, success_rate: 0.873, catastrophic_rate: 0.021, is_ours: true },
  { agent: "Standard PPO", mean_reward: 12.3, cvar_005: -6.97, success_rate: 0.724, catastrophic_rate: 0.084 },
  { agent: "DQN", mean_reward: 9.8, cvar_005: -8.42, success_rate: 0.651, catastrophic_rate: 0.112 },
  { agent: "Random Agent", mean_reward: -2.1, cvar_005: -15.3, success_rate: 0.123, catastrophic_rate: 0.342 },
  { agent: "Rule-Based", mean_reward: 8.4, cvar_005: -5.21, success_rate: 0.698, catastrophic_rate: 0.067 },
];

export const mockExplanations: ExplanationCard[] = [
  {
    action: "Isolate User1", step: 1247801, threat: "Active reverse shell with privilege escalation chain",
    obs_decoded: "User1: 2 malicious processes, 1 privileged session, lateral movement indicators",
    risk_score: 0.92, severity: "CRITICAL",
    why: "User1 has an active reverse shell and is attempting lateral movement to Enterprise0. Immediate isolation prevents further spread.",
    risk_mitigated: "Blocked lateral movement path to Enterprise0 and Op_Server0. Prevented potential data exfiltration.",
    follow_up: "Forensic analysis of User1. Check Enterprise0 for IOCs. Update firewall rules for subnet 10.0.1.0/24.",
    cve_ids: ["CVE-2024-1234", "CVE-2023-5678"],
    mitre_techniques: ["T1059", "T1190", "T1021"],
  },
  {
    action: "Deploy Decoy Enterprise0", step: 1247790, threat: "Attacker reconnaissance on enterprise subnet",
    obs_decoded: "Enterprise0: scanning activity detected, no compromise yet",
    risk_score: 0.65, severity: "HIGH",
    why: "Deploying a decoy on Enterprise0 will divert attacker attention and gather intelligence on attack patterns.",
    risk_mitigated: "Attacker diverted from real Enterprise0 assets. Intelligence gathered on attacker TTPs.",
    follow_up: "Monitor decoy interactions. Update threat model with new attacker behavior data.",
    cve_ids: ["CVE-2024-5678"],
    mitre_techniques: ["T1595", "T1046"],
  },
];

export const mockDriftHistory: DriftPoint[] = Array.from({ length: 50 }, (_, i) => ({
  step: 1200000 + i * 1000,
  distance: 0.05 + Math.random() * 0.08 + (i > 40 ? 0.04 : 0),
  is_drift: i > 45 && Math.random() > 0.7,
}));

export const mockTrainingHistory = Array.from({ length: 200 }, (_, i) => ({
  step: i * 1000,
  mean_reward: -5 + (i / 200) * 20 + (Math.random() - 0.5) * 3,
  cvar_005: -10 + (i / 200) * 8 + (Math.random() - 0.5) * 2,
  loss: 0.1 * Math.exp(-i / 50) + Math.random() * 0.005,
}));
