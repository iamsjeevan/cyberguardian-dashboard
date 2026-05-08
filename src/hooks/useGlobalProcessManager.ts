import { useEffect, useRef } from "react";
import { useProcessStore, type ScanHost } from "@/stores/processStore";
import { toast } from "sonner";

const VENDORS = ["Cisco", "Apple", "Dell", "HP", "Ubiquiti", "Netgear", "Intel", "Raspberry Pi"];
const OSES = ["Linux 5.15", "Windows 11 Pro", "macOS 14.4", "FreeBSD 13", "iOS 17", "Android 14"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genHost(i: number, target: string): ScanHost {
  const base = target.split("/")[0].split(".").slice(0, 3).join(".");
  const allPorts = [22, 80, 443, 21, 25, 53, 110, 139, 445, 3306, 3389, 8080, 8443, 5900];
  const ports = allPorts.filter(() => Math.random() > 0.7);
  return {
    ip: `${base}.${10 + i}`,
    mac: Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()
    ).join(":"),
    vendor: rand(VENDORS),
    ports: ports.length ? ports : [80],
    status: Math.random() > 0.15 ? "Active" : "Inactive",
    os: rand(OSES),
    latency: `${(Math.random() * 40 + 1).toFixed(2)} ms`,
    hostname: `host-${(10 + i).toString(16)}.local`,
  };
}

/**
 * Single global tick that drives GAN training, scans, and system health.
 * Mounted once at the App level so processes continue across navigation.
 */
export function useGlobalProcessManager() {
  const tick = useRef(0);

  useEffect(() => {
    const intv = setInterval(() => {
      tick.current += 1;
      const s = useProcessStore.getState();

      // System health drift
      s.setHealth(
        Math.max(5, Math.min(95, s.cpu + (Math.random() - 0.5) * 8)),
        Math.max(15, Math.min(95, s.ram + (Math.random() - 0.5) * 4))
      );

      // GAN initialization phase
      if (s.ganInitializing) {
        s.pushLog({ source: "GAN", level: "INFO", message: "Initializing generator + discriminator weights..." });
        s.pushLog({ source: "GAN", level: "INFO", message: `LR=${s.ganConfig.learningRate} BATCH=${s.ganConfig.batchSize} EPOCHS=${s.ganConfig.epochs}` });
        s._setGan({ ganInitializing: false, ganRunning: true });
      }

      // GAN training tick
      if (s.ganRunning) {
        const stepPct = 100 / s.ganConfig.epochs;
        const nextProgress = Math.min(100, s.ganProgress + stepPct);
        const nextEpoch = Math.min(s.ganConfig.epochs, s.ganEpoch + 1);
        const t = nextEpoch / s.ganConfig.epochs;
        const loss = Math.max(0.05, 1.4 * Math.exp(-2.2 * t) + (Math.random() - 0.5) * 0.08);
        const accuracy = Math.min(99.9, 50 + 48 * (1 - Math.exp(-3 * t)) + (Math.random() - 0.5) * 1.2);

        s._setGan({
          ganProgress: nextProgress,
          ganEpoch: nextEpoch,
          ganLoss: [...s.ganLoss, { epoch: nextEpoch, loss, accuracy }].slice(-200),
        });

        s.pushLog({
          source: "GAN",
          level: "INFO",
          message: `[Epoch ${nextEpoch}/${s.ganConfig.epochs}] G_loss=${loss.toFixed(3)} D_acc=${accuracy.toFixed(2)}%`,
        });

        if (nextEpoch >= s.ganConfig.epochs) {
          s._setGan({ ganRunning: false });
          s.pushLog({ source: "GAN", level: "OK", message: "Training complete. Checkpoint saved." });
          toast.success("GAN training complete", { description: `Final loss ${loss.toFixed(3)} · acc ${accuracy.toFixed(1)}%` });
        }
      }

      // Scan tick
      if (s.scanRunning) {
        const next = Math.min(100, s.scanProgress + 100 / 8); // ~4s
        s._setScan({ scanProgress: next });
        if (next >= 100) {
          const count = 6 + Math.floor(Math.random() * 6);
          const hosts = Array.from({ length: count }, (_, i) => genHost(i, s.scanTarget));
          s._setScan({ scanRunning: false, scanHosts: hosts });
          s.pushLog({ source: "SCAN", level: "OK", message: `Scan of ${s.scanTarget} complete — ${hosts.length} hosts discovered.` });
          toast.success("Network scan complete", { description: `${hosts.length} live hosts on ${s.scanTarget}` });
        } else if (Math.random() > 0.6) {
          s.pushLog({ source: "SCAN", level: "INFO", message: `Probing ${s.scanTarget} … ${Math.round(next)}%` });
        }
      }
    }, 500);

    return () => clearInterval(intv);
  }, []);
}
