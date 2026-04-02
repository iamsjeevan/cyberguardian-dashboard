import { Panel } from "@/components/dashboard/Panel";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const mockKGNodes = [
  { id: "CVE-2024-1234", label: "CVE-2024-1234", type: "CVE" as const },
  { id: "CVE-2023-5678", label: "CVE-2023-5678", type: "CVE" as const },
  { id: "CVE-2024-5678", label: "CVE-2024-5678", type: "CVE" as const },
  { id: "T1059", label: "Command & Scripting", type: "Technique" as const },
  { id: "T1190", label: "Exploit Public App", type: "Technique" as const },
  { id: "T1021", label: "Remote Services", type: "Technique" as const },
  { id: "T1595", label: "Active Scanning", type: "Technique" as const },
  { id: "T1046", label: "Network Scanning", type: "Technique" as const },
  { id: "TA0001", label: "Initial Access", type: "Tactic" as const },
  { id: "TA0002", label: "Execution", type: "Tactic" as const },
  { id: "User1", label: "User1", type: "Host" as const },
  { id: "Enterprise0", label: "Enterprise0", type: "Host" as const },
];

const mockKGEdges = [
  { source: "CVE-2024-1234", target: "T1190", relation: "MAPS_TO" },
  { source: "CVE-2024-1234", target: "T1059", relation: "MAPS_TO" },
  { source: "CVE-2023-5678", target: "T1021", relation: "MAPS_TO" },
  { source: "CVE-2024-5678", target: "T1595", relation: "MAPS_TO" },
  { source: "T1190", target: "TA0001", relation: "BELONGS_TO" },
  { source: "T1059", target: "TA0002", relation: "BELONGS_TO" },
  { source: "CVE-2024-1234", target: "User1", relation: "AFFECTS" },
  { source: "CVE-2024-5678", target: "Enterprise0", relation: "AFFECTS" },
];

const typeColor: Record<string, string> = {
  CVE: "#ff3366", Technique: "#00d4ff", Tactic: "#ffaa00", Host: "#3d7a9e",
};

export default function KGPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<typeof mockKGNodes[0] | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const w = svgRef.current.clientWidth;
    const h = svgRef.current.clientHeight;

    const nodes = mockKGNodes.map(n => ({ ...n }));
    const links = mockKGEdges.map(e => ({ ...e }));

    const sim = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(w / 2, h / 2));

    const g = svg.append("g");

    // zoom
    svg.call(d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 3]).on("zoom", (e) => {
      g.attr("transform", e.transform);
    }) as any);

    const link = g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", "#0d3a5c").attr("stroke-width", 1);

    const linkLabel = g.append("g").selectAll("text").data(links).join("text")
      .text(d => d.relation).attr("font-size", "7px").attr("fill", "#3d7a9e")
      .attr("font-family", "JetBrains Mono").attr("text-anchor", "middle");

    const node = g.append("g").selectAll("g").data(nodes).join("g").attr("cursor", "pointer")
      .on("click", (_, d) => setSelectedNode(d as any));

    node.append("circle").attr("r", 10).attr("fill", d => typeColor[d.type] + "30")
      .attr("stroke", d => typeColor[d.type]).attr("stroke-width", 1.5);

    node.append("text").text(d => d.label).attr("dy", 20).attr("text-anchor", "middle")
      .attr("font-size", "8px").attr("fill", "#7ab3d4").attr("font-family", "JetBrains Mono");

    sim.on("tick", () => {
      link.attr("x1", (d: any) => d.source.x).attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x).attr("y2", (d: any) => d.target.y);
      linkLabel.attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { sim.stop(); };
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-7rem)]">
      <Panel title="Knowledge Graph" className="col-span-8 h-full" glow delay={0}>
        <svg ref={svgRef} className="w-full h-full" style={{ minHeight: 400 }} />
      </Panel>

      <div className="col-span-4 space-y-4">
        <Panel title="Legend" delay={1}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(typeColor).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color + "50", border: `1px solid ${color}` }} />
                <span className="font-mono text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </Panel>

        {selectedNode ? (
          <Panel title={`Node: ${selectedNode.label}`} glow delay={2}>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-mono text-muted-foreground block">TYPE</span>
                <span className="font-mono" style={{ color: typeColor[selectedNode.type] }}>{selectedNode.type}</span>
              </div>
              <div>
                <span className="font-mono text-muted-foreground block">ID</span>
                <span className="font-mono text-foreground">{selectedNode.id}</span>
              </div>
              <div>
                <span className="font-mono text-muted-foreground block">CONNECTIONS</span>
                {mockKGEdges
                  .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                  .map((e, i) => (
                    <div key={i} className="font-mono text-[10px] text-muted-foreground">
                      {e.source === selectedNode.id ? `→ ${e.relation} → ${e.target}` : `${e.source} → ${e.relation} →`}
                    </div>
                  ))}
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="Node Detail" delay={2}>
            <div className="flex items-center justify-center h-32">
              <span className="font-mono text-xs text-muted-foreground animate-glow-pulse">SELECT A NODE...</span>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
