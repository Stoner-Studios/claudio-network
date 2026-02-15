"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { GraphNode } from "@/types/persona";
import { GraphData, getRelationColor } from "@/lib/graphData";

interface NetworkGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  claudioName?: string;
}

interface ExtendedNode extends GraphNode {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
}

export default function NetworkGraph({
  data,
  onNodeClick,
  claudioName = "Claudio Naranjo",
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<ExtendedNode, any> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Función para identificar si es Claudio
  const isClaudioNode = (name: string) =>
    name === claudioName || name === "Claudio Naranjo";

  // Actualizar dimensiones cuando cambia el contenedor
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const drawGraph = useCallback(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const { width, height } = dimensions;

    // Detener simulación anterior si existe
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Limpiar el SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);

    // Crear grupo principal con zoom
    const g = svg.append("g");

    // Configurar zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Preparar nodos con posiciones iniciales
    const nodes: ExtendedNode[] = data.nodes.map((d) => {
      const isClaudio = isClaudioNode(d.name);
      return {
        ...d,
        x: isClaudio ? width / 2 : width / 2 + (Math.random() - 0.5) * 300,
        y: isClaudio ? height / 2 : height / 2 + (Math.random() - 0.5) * 300,
        fx: isClaudio ? width / 2 : null,
        fy: isClaudio ? height / 2 : null,
      };
    });

    // Preparar links con referencias a índices
    const links = data.links
      .map((d) => ({
        source: nodes.findIndex((n) => n.id === d.source || n.name === d.source),
        target: nodes.findIndex((n) => n.id === d.target || n.name === d.target),
        type: d.type,
      }))
      .filter((l) => l.source !== -1 && l.target !== -1);

    // Crear simulación de fuerza - configurada para estabilidad
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).distance(100).strength(0.3)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .alphaDecay(0.05) // Converge más rápido
      .velocityDecay(0.4); // Más estable

    simulationRef.current = simulation;

    // Dibujar links
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => getRelationColor(d.type))
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    // Etiquetas de relación (solo si hay pocos nodos para evitar saturación)
    const showLabels = nodes.length <= 30;
    let linkLabels: any = null;

    if (showLabels) {
      linkLabels = g
        .append("g")
        .selectAll("text")
        .data(links)
        .join("text")
        .attr("font-size", 8)
        .attr("fill", "#6b7280")
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none")
        .text((d: any) => {
          const type = d.type || "";
          // Acortar tipos de relación largos
          return type.length > 12 ? type.substring(0, 10) + "..." : type;
        });
    }

    // Dibujar nodos
    const node = g
      .append("g")
      .selectAll<SVGGElement, ExtendedNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer");

    // Círculos de los nodos
    node
      .append("circle")
      .attr("r", (d) => {
        if (isClaudioNode(d.name)) return 30;
        return Math.sqrt(d.mentions) * 1.5 + 6;
      })
      .attr("fill", (d) => {
        if (isClaudioNode(d.name)) return "#f59e0b";
        return d.hasBio ? "#3b82f6" : "#94a3b8";
      })
      .attr("stroke", (d) => {
        if (isClaudioNode(d.name)) return "#fbbf24";
        return "#fff";
      })
      .attr("stroke-width", (d) => (isClaudioNode(d.name) ? 3 : 2))
      .on("click", (_event, d) => {
        if (onNodeClick) onNodeClick(d);
      });

    // Labels de los nodos
    node
      .append("text")
      .text((d) => {
        if (isClaudioNode(d.name)) return "Claudio";
        if (d.mentions > 20) return d.name.split(" ")[0];
        return "";
      })
      .attr("font-size", (d) => (isClaudioNode(d.name) ? 11 : 9))
      .attr("font-weight", (d) => (isClaudioNode(d.name) ? "bold" : "normal"))
      .attr("dx", (d) => {
        if (isClaudioNode(d.name)) return 0;
        return Math.sqrt(d.mentions) * 1.5 + 10;
      })
      .attr("dy", (d) => {
        if (isClaudioNode(d.name)) return 45;
        return 3;
      })
      .attr("text-anchor", (d) => (isClaudioNode(d.name) ? "middle" : "start"))
      .attr("fill", (d) => (isClaudioNode(d.name) ? "#f59e0b" : "#374151"))
      .attr("pointer-events", "none");

    // Actualizar posiciones en cada tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      // Posicionar etiquetas de relación en el punto medio del link
      if (linkLabels) {
        linkLabels
          .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
          .attr("y", (d: any) => (d.source.y + d.target.y) / 2);
      }

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Guardar referencia al zoom para los botones
    (svg as any).zoomBehavior = zoom;
    (svg as any).mainGroup = g;

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, dimensions, claudioName, onNodeClick, isClaudioNode]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  // Función para centrar en un nodo específico
  const centerOnNode = (nodeName: string) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoom = (svg as any).zoomBehavior;
    const g = (svg as any).mainGroup;
    if (!zoom || !g) return;

    // Buscar el nodo en los datos
    const node = data.nodes.find(n => n.name === nodeName || n.id === nodeName);
    if (!node) return;

    // Calcular transformación para centrar
    const { width, height } = dimensions;
    const x = node.x || width / 2;
    const y = node.y || height / 2;

    const transform = d3.zoomIdentity
      .translate(width / 2 - x, height / 2 - y)
      .scale(1.5);

    svg.transition().duration(500).call(zoom.transform, transform);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />

      {/* Controles de zoom */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            if (svgRef.current) {
              const svg = d3.select(svgRef.current);
              const zoom = (svg as any).zoomBehavior;
              if (zoom) {
                svg.transition().call(zoom.scaleBy, 1.3);
              }
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50"
        >
          +
        </button>
        <button
          onClick={() => {
            if (svgRef.current) {
              const svg = d3.select(svgRef.current);
              const zoom = (svg as any).zoomBehavior;
              if (zoom) {
                svg.transition().call(zoom.scaleBy, 0.7);
              }
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50"
        >
          −
        </button>
        <button
          onClick={() => {
            if (svgRef.current) {
              const svg = d3.select(svgRef.current);
              const zoom = (svg as any).zoomBehavior;
              if (zoom) {
                svg.transition().call(zoom.transform, d3.zoomIdentity);
              }
            }
          }}
          className="w-10 h-10 bg-white rounded-lg shadow border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
