import { create } from "zustand";
import type { Host, Alert, BeliefState, TrainingStatus, DriftStatus } from "@/lib/api/client";
import { mockHosts, mockAlerts, mockTrainingStatus, mockDrift, mockBelief } from "@/lib/mock-data";

interface AppState {
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  
  hosts: Host[];
  setHosts: (h: Host[]) => void;
  
  alerts: Alert[];
  setAlerts: (a: Alert[]) => void;
  acknowledgeAlert: (id: string) => void;
  
  training: TrainingStatus;
  setTraining: (t: TrainingStatus) => void;
  isTraining: boolean;
  setIsTraining: (v: boolean) => void;
  
  drift: DriftStatus;
  setDrift: (d: DriftStatus) => void;
  
  belief: BeliefState;
  setBelief: (b: BeliefState) => void;
  
  selectedHost: string | null;
  setSelectedHost: (h: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarExpanded: true,
  toggleSidebar: () => set((s) => ({ sidebarExpanded: !s.sidebarExpanded })),
  
  hosts: mockHosts,
  setHosts: (hosts) => set({ hosts }),
  
  alerts: mockAlerts,
  setAlerts: (alerts) => set({ alerts }),
  acknowledgeAlert: (id) => set((s) => ({
    alerts: s.alerts.map((a) => a.id === id ? { ...a, acknowledged: true } : a),
  })),
  
  training: mockTrainingStatus,
  setTraining: (training) => set({ training }),
  isTraining: true,
  setIsTraining: (isTraining) => set({ isTraining }),
  
  drift: mockDrift,
  setDrift: (drift) => set({ drift }),
  
  belief: mockBelief,
  setBelief: (belief) => set({ belief }),
  
  selectedHost: null,
  setSelectedHost: (selectedHost) => set({ selectedHost }),
}));
