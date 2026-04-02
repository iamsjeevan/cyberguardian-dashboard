import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useAppStore } from "@/stores/appStore";
import type { Host } from "@/lib/api/client";

const statusColor: Record<string, string> = {
  CLEAN: "#00ff9d",
  COMPROMISED: "#ff3366",
  ISOLATED: "#ffaa00",
  DECOY: "#a855f7",
  RESTORED: "#00d4ff",
};

const subnetLinks = [
  ["User0", "User1"], ["User1", "User2"],
  ["User3", "User4"], ["User0", "Enterprise0"],
  ["Enterprise0", "Op_Server0"], ["User3", "Enterprise0"],
];

export function NetworkTopologyPanel() {
  const svgRef = useRef<SVGSVGElement>(null);
  const hosts = useAppStore((s) => s.hosts);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes = hosts.map((h) => ({ ...h, id: h.name }));
    const links = subnetLinks
      .filter(([s, t]) => nodes.find((n) => n.id === s) && nodes.find((n) => n.id === t))
      .map(([source, target]) => ({ source, target }));

    const sim = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide(30));

    const g = svg.append("g");

    // Edges
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#0d3a5c")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6);

    // Nodes
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer");

    // Node circles
    node.append("circle")
      .attr("r", (d) => d.name === "Op_Server0" ? 18 : 12)
      .attr("fill", (d) => statusColor[d.status] + "30")
      .attr("stroke", (d) => statusColor[d.status])
      .attr("stroke-width", (d) => d.name === "Op_Server0" ? 3 : 1.5);

    // Op_Server0 golden ring
    node.filter((d) => d.name === "Op_Server0")
      .append("circle")
      .attr("r", 22)
      .attr("fill", "none")
      .attr("stroke", "#ffd700")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.6);

    // Pulse for compromised
    node.filter((d) => d.status === "COMPROMISED")
      .append("circle")
      .attr("r", 16)
      .attr("fill", "none")
      .attr("stroke", "#ff3366")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5)
      .append("animate")
      .attr("attributeName", "r")
      .attr("from", "12")
      .attr("to", "24")
      .attr("dur", "1.5s")
      .attr("repeatCount", "indefinite");

    // Labels
    node.append("text")
      .text((d) => d.name.replace("_", " "))
      .attr("text-anchor", "middle")
      .attr("dy", (d) => d.name === "Op_Server0" ? 32 : 24)
      .attr("fill", "#7ab3d4")
      .attr("font-size", "9px")
      .attr("font-family", "JetBrains Mono");

    // Tooltip
    node.append("title")
      .text((d) => `${d.name}\nStatus: ${d.status}\nSubnet: ${d.subnet}\nMalicious: ${d.malicious_processes.length}\nPrivileged: ${d.privileged_sessions.length}`);

    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, [hosts]);

  return (
    <svg ref={svgRef} className="w-full h-full" style={{ minHeight: 250 }} />
  );
}
