import { create } from "zustand";

export interface LogLine {
  id: string;
  ts: string;
  source: "GAN" | "SCAN" | "SYSTEM";
  level: "INFO" | "WARN" | "ERROR" | "OK";
  message: string;
}

export interface LossPoint {
  epoch: number;
  loss: number;
  accuracy: number;
}

export interface ScanHost {
  ip: string;
  mac: string;
  vendor: string;
  ports: number[];
  status: "Active" | "Inactive";
  os: string;
  latency: string;
  hostname: string;
}

export interface GANConfig {
  learningRate: number;
  epochs: number;
  batchSize: number;
}

interface ProcessState {
  // GAN training
  ganRunning: boolean;
  ganInitializing: boolean;
  ganProgress: number; // 0..100
  ganEpoch: number;
  ganConfig: GANConfig;
  ganLoss: LossPoint[];
  setGanConfig: (c: Partial<GANConfig>) => void;
  startGan: () => void;
  stopGan: () => void;
  _setGan: (p: Partial<ProcessState>) => void;

  // Network scan
  scanRunning: boolean;
  scanProgress: number;
  scanTarget: string;
  scanHosts: ScanHost[];
  setScanTarget: (t: string) => void;
  startScan: () => void;
  stopScan: () => void;
  _setScan: (p: Partial<ProcessState>) => void;

  // Global logs
  logs: LogLine[];
  pushLog: (l: Omit<LogLine, "id" | "ts">) => void;
  clearLogs: () => void;

  // System health
  cpu: number;
  ram: number;
  setHealth: (cpu: number, ram: number) => void;
}

export const useProcessStore = create<ProcessState>((set) => ({
  ganRunning: false,
  ganInitializing: false,
  ganProgress: 0,
  ganEpoch: 0,
  ganConfig: { learningRate: 0.0002, epochs: 50, batchSize: 64 },
  ganLoss: [],
  setGanConfig: (c) => set((s) => ({ ganConfig: { ...s.ganConfig, ...c } })),
  startGan: () =>
    set({
      ganInitializing: true,
      ganRunning: false,
      ganProgress: 0,
      ganEpoch: 0,
      ganLoss: [],
    }),
  stopGan: () =>
    set({ ganRunning: false, ganInitializing: false }),
  _setGan: (p) => set(p),

  scanRunning: false,
  scanProgress: 0,
  scanTarget: "192.168.1.0/24",
  scanHosts: [],
  setScanTarget: (scanTarget) => set({ scanTarget }),
  startScan: () => set({ scanRunning: true, scanProgress: 0, scanHosts: [] }),
  stopScan: () => set({ scanRunning: false }),
  _setScan: (p) => set(p),

  logs: [
    {
      id: "boot",
      ts: new Date().toISOString(),
      source: "SYSTEM",
      level: "OK",
      message: "ACD operations console online.",
    },
  ],
  pushLog: (l) =>
    set((s) => ({
      logs: [
        {
          ...l,
          id: Math.random().toString(36).slice(2),
          ts: new Date().toISOString(),
        },
        ...s.logs,
      ].slice(0, 500),
    })),
  clearLogs: () => set({ logs: [] }),

  cpu: 12,
  ram: 38,
  setHealth: (cpu, ram) => set({ cpu, ram }),
}));
