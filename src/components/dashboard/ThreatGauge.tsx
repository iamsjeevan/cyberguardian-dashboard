import { useNetworkTopology } from "@/hooks/useApiData";
import CountUp from "react-countup";

export function ThreatGauge() {
  const { data: topology } = useNetworkTopology();
  const hosts = topology?.hosts ?? [];
  const compromised = hosts.filter((h) => h.status === "COMPROMISED").length;
  const total = hosts.length || 1;
  const threat = Math.round((compromised / total) * 100);

  const color = threat > 60 ? "text-destructive" : threat > 30 ? "text-warning" : "text-secondary";
  const strokeColor = threat > 60 ? "#ff3366" : threat > 30 ? "#ffaa00" : "#00ff9d";

  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const progress = (threat / 100) * circ * 0.75;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg width="160" height="130" viewBox="0 0 160 130">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#0d3a5c" strokeWidth="8"
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
          strokeLinecap="round" transform="rotate(135 80 80)" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke={strokeColor} strokeWidth="8"
          strokeDasharray={`${progress} ${circ - progress}`}
          strokeLinecap="round" transform="rotate(135 80 80)"
          style={{ filter: `drop-shadow(0 0 6px ${strokeColor}60)`, transition: "stroke-dasharray 1s" }} />
      </svg>
      <div className={`-mt-14 text-center ${color}`}>
        <span className="font-mono text-3xl font-bold glow-text">
          <CountUp end={threat} duration={1.5} />%
        </span>
        <p className="font-mono text-[10px] text-muted-foreground mt-1 uppercase">Threat Level</p>
      </div>
    </div>
  );
}
