"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { GraphNode } from "@/types/persona";
import { GraphData, getRelationColor, isBidirectional } from "@/lib/graphData";

interface NetworkGraphProps {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
  onNodeCenter?: (node: GraphNode) => void;
  claudioName?: string;
  centeredNode?: string | null; // Nombre del nodo a centrar
}

interface ExtendedNode extends GraphNode {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
  ring?: number;
  angle?: number;
  clipId?: string;
}

interface ExtendedLink {
  source: ExtendedNode;
  target: ExtendedNode;
  type: string;
  fuerza_vinculo?: number;
}

export default function NetworkGraph({
  data,
  onNodeClick,
  onNodeCenter,
  claudioName = "Claudio Naranjo",
  centeredNode = null,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<ExtendedNode, any> | null>(null);
  const nodesRef = useRef<ExtendedNode[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Función para identificar si es Claudio
  const isClaudioNode = (name: string) =>
    name === claudioName || name === "Claudio Naranjo";

  // Función para obtener el radio de un nodo
  const getNodeRadius = (d: ExtendedNode, isCenter: boolean = false) => {
    if (isCenter) return 28;
    return Math.sqrt(d.mentions) * 1.5 + 8;
  };

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

  // Función para reorganizar el grafo con un nuevo centro
  const reorganizeAroundNode = useCallback((nodeName: string) => {
    if (!simulationRef.current || !nodesRef.current.length) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Fijar el nuevo centro y liberar los demás
    nodesRef.current.forEach(n => {
      if (n.name === nodeName || n.id === nodeName) {
        n.fx = centerX;
        n.fy = centerY;
        n.x = centerX;
        n.y = centerY;
      } else {
        n.fx = null;
        n.fy = null;
      }
    });

    // Reiniciar la simulación con más energía
    simulationRef.current.alpha(0.8).restart();
  }, [dimensions]);

  // Reorganizar cuando cambia centeredNode
  useEffect(() => {
    if (centeredNode && simulationRef.current) {
      reorganizeAroundNode(centeredNode);
    }
  }, [centeredNode, reorganizeAroundNode]);

  const drawGraph = useCallback(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;

    // Determinar el centro actual (la persona seleccionada o Claudio por defecto)
    const centerName = centeredNode || claudioName;

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

    // Determinar layout
    const useCircularLayout = data.nodes.length <= 20;

    // Preparar nodos
    let nodes: ExtendedNode[];

    if (useCircularLayout) {
      // Layout circular concéntrico
      const centerNodeData = data.nodes.find((n) => n.name === centerName);
      const otherNodes = data.nodes
        .filter((n) => n.name !== centerName)
        .sort((a, b) => b.mentions - a.mentions);

      if (!centerNodeData) return;

      const minDimension = Math.min(width, height);
      const baseRadius = minDimension * 0.15;

      nodes = [];

      // Nodo central (la persona seleccionada, no siempre Claudio)
      nodes.push({
        ...centerNodeData,
        x: centerX,
        y: centerY,
        fx: centerX,
        fy: centerY,
        ring: 0,
        angle: 0,
      });

      // Distribuir en anillos (incluyendo a Claudio si no es el centro)
      otherNodes.forEach((node, i) => {
        const ring = i < 6 ? 1 : i < 14 ? 2 : 3;
        const ringNodes = otherNodes.filter((_, j) =>
          ring === 1 ? j < 6 : ring === 2 ? j >= 6 && j < 14 : j >= 14
        );
        const indexInRing = ringNodes.indexOf(node);
        const ringRadius = baseRadius * (ring === 1 ? 1 : ring === 2 ? 1.7 : 2.4);
        const angle = (indexInRing / ringNodes.length) * 2 * Math.PI - Math.PI / 2;

        nodes.push({
          ...node,
          x: centerX + ringRadius * Math.cos(angle),
          y: centerY + ringRadius * Math.sin(angle),
          fx: null,
          fy: null,
          ring,
          angle,
        });
      });

    } else {
      // Force-directed
      nodes = data.nodes.map((d) => {
        const isCenter = d.name === centerName;
        return {
          ...d,
          x: isCenter ? width / 2 : width / 2 + (Math.random() - 0.5) * 500,
          y: isCenter ? height / 2 : height / 2 + (Math.random() - 0.5) * 500,
          fx: isCenter ? width / 2 : null,
          fy: isCenter ? height / 2 : null,
        };
      });
    }

    // Guardar referencia a los nodos
    nodesRef.current = nodes;

    // Crear mapa de nodos para buscar por nombre
    const nodeMap = new Map<string, ExtendedNode>();
    nodes.forEach(n => nodeMap.set(n.name, n));

    // Preparar links con referencias a objetos nodo
    const links = data.links
      .map((d) => {
        const sourceNode = nodeMap.get(String(d.source));
        const targetNode = nodeMap.get(String(d.target));
        if (!sourceNode || !targetNode) return null;
        return {
          source: sourceNode,
          target: targetNode,
          type: d.type,
          fuerza_vinculo: d.fuerza_vinculo || 1,
        };
      })
      .filter((l): l is {
        source: ExtendedNode;
        target: ExtendedNode;
        type: string;
        fuerza_vinculo: number;
      } => l !== null);

    // Dibujar círculos de fondo si es layout circular
    if (useCircularLayout) {
      const minDimension = Math.min(width, height);
      const baseRadius = minDimension * 0.15;
      [1, 2, 3].forEach((ring) => {
        const radius = baseRadius * (ring === 1 ? 1 : ring === 2 ? 1.7 : 2.4);
        g.append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", radius)
          .attr("fill", "none")
          .attr("stroke", "#e2e8f0")
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", "4,4")
          .attr("opacity", 0.5);
      });
    }

    // Crear simulación solo para force-directed
    if (!useCircularLayout) {
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          "link",
          d3.forceLink<ExtendedNode, ExtendedLink>(links)
            .id((d) => d.name)
            .distance((d) => {
              const sourceRadius = getNodeRadius(d.source, d.source.name === centerName);
              const targetRadius = getNodeRadius(d.target, d.target.name === centerName);
              return sourceRadius + targetRadius + 40;
            })
            .strength(0.3)
        )
        .force("charge", d3.forceManyBody().strength(-250))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius((d: any) => getNodeRadius(d, d.name === centerName) + 10))
        .alphaDecay(0.02)
        .velocityDecay(0.3);

      simulationRef.current = simulation;
    } else {
      simulationRef.current = null;
    }

    // Definir marcadores de flecha
    const defs = svg.append("defs");

    // Crear clipPaths y patterns para fotos
    nodes.forEach((d, i) => {
      if (d.foto_url) {
        // Crear clipPath circular para cada nodo con foto
        const clipId = `clip-${i}-${d.id.replace(/\s+/g, '-')}`;
        defs
          .append("clipPath")
          .attr("id", clipId)
          .append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("r", getNodeRadius(d, d.name === centerName) - 2);

        // Guardar el clipId en el nodo para usarlo después
        (d as any).clipId = clipId;
      }
    });

    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 6)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M0,-3 L6,0 L0,3 Z")
      .attr("fill", "#94a3b8");

    defs
      .append("marker")
      .attr("id", "arrow-start")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 2)
      .attr("refY", 0)
      .attr("orient", "auto-start-reverse")
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .append("path")
      .attr("d", "M6,-3 L0,0 L6,3 Z")
      .attr("fill", "#94a3b8");

    // Dibujar links - grosor basado en fuerza_vinculo (1-10)
    const link = g
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) => getRelationColor(d.type))
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d) => {
        const fuerza = d.fuerza_vinculo || 1;
        return 0.5 + (fuerza / 10) * 3; // Entre 0.5 y 3.5
      });

    // Añadir flechas según tipo de relación
    link.each(function(d) {
      const line = d3.select(this);
      const bidirectional = isBidirectional(d.type);
      if (bidirectional) {
        line.attr("marker-start", "url(#arrow-start)").attr("marker-end", "url(#arrow)");
      } else {
        line.attr("marker-end", "url(#arrow)");
      }
    });

    // Etiquetas de relación
    const showLabels = nodes.length <= 30;
    let linkLabels: any = null;

    if (showLabels) {
      linkLabels = g
        .append("g")
        .selectAll("g")
        .data(links)
        .join("g")
        .attr("pointer-events", "none");

      linkLabels
        .append("rect")
        .attr("fill", "white")
        .attr("fill-opacity", 0.9)
        .attr("rx", 2)
        .attr("ry", 2);

      linkLabels
        .append("text")
        .attr("font-size", 7)
        .attr("fill", "#6b7280")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d: ExtendedLink) => {
          const type = d.type || "";
          return type.length > 10 ? type.substring(0, 8) + "..." : type;
        })
        .each(function(this: SVGTextElement) {
          const bbox = this.getBBox();
          const rect = (this.parentNode as SVGGElement).querySelector("rect");
          if (rect) {
            rect.setAttribute("x", String(bbox.x - 2));
            rect.setAttribute("y", String(bbox.y - 1));
            rect.setAttribute("width", String(bbox.width + 4));
            rect.setAttribute("height", String(bbox.height + 2));
          }
        });
    }

    // Dibujar nodos
    const node = g
      .append("g")
      .selectAll<SVGGElement, ExtendedNode>("g")
      .data(nodes)
      .join("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer");

    // Círculos de fondo (para el color del borde)
    node
      .append("circle")
      .attr("r", (d) => getNodeRadius(d, d.name === centerName))
      .attr("fill", (d) => {
        if (d.foto_url) return "#e5e7eb"; // Fondo gris claro si tiene foto
        if (d.name === centerName) return "#f59e0b"; // Solo el centro es ámbar
        return d.hasBio ? "#3b82f6" : "#94a3b8";
      })
      .attr("stroke", (d) => {
        if (d.name === centerName) return "#fbbf24";
        if (d.foto_url) {
          // Color según tipo de relación si tiene foto
          return d.hasBio ? "#3b82f6" : "#94a3b8";
        }
        return "#fff";
      })
      .attr("stroke-width", (d) => (d.name === centerName ? 3 : d.foto_url ? 3 : 2))
      .on("click", (_event, d) => {
        if (onNodeClick) onNodeClick(d);
        if (onNodeCenter) onNodeCenter(d);
      });

    // Fotos de los nodos (si tienen)
    node.each(function(d) {
      if (d.foto_url && (d as any).clipId) {
        const group = d3.select(this);
        const radius = getNodeRadius(d, d.name === centerName);
        group
          .append("image")
          .attr("href", d.foto_url)
          .attr("x", -radius + 3)
          .attr("y", -radius + 3)
          .attr("width", (radius - 3) * 2)
          .attr("height", (radius - 3) * 2)
          .attr("clip-path", `url(#${(d as any).clipId})`)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .style("pointer-events", "none");
      }
    });

    // Labels de los nodos
    node
      .append("text")
      .text((d) => {
        if (d.name === centerName) return d.name.split(" ")[0];
        if (d.mentions > 12) return d.name.split(" ")[0];
        return "";
      })
      .attr("font-size", (d) => (d.name === centerName ? 11 : 9))
      .attr("font-weight", (d) => (d.name === centerName ? "bold" : "normal"))
      .attr("dx", (d) => {
        if (d.name === centerName) return 0;
        return getNodeRadius(d, false) + 4;
      })
      .attr("dy", (d) => {
        if (d.name === centerName) return getNodeRadius(d, true) + 16;
        return 3;
      })
      .attr("text-anchor", (d) => (d.name === centerName ? "middle" : "start"))
      .attr("fill", (d) => (d.name === centerName ? "#f59e0b" : "#374151"))
      .attr("pointer-events", "none");

    // Función para actualizar posiciones de links con flechas fuera de los círculos
    const updateLinkPositions = () => {
      link.attr("x1", (d: ExtendedLink) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return d.source.x;
        const sourceRadius = getNodeRadius(d.source, d.source.name === centerName);
        return d.source.x + (dx / dist) * sourceRadius;
      })
      .attr("y1", (d: ExtendedLink) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return d.source.y;
        const sourceRadius = getNodeRadius(d.source, d.source.name === centerName);
        return d.source.y + (dy / dist) * sourceRadius;
      })
      .attr("x2", (d: ExtendedLink) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return d.target.x;
        const targetRadius = getNodeRadius(d.target, d.target.name === centerName);
        return d.target.x - (dx / dist) * targetRadius;
      })
      .attr("y2", (d: ExtendedLink) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return d.target.y;
        const targetRadius = getNodeRadius(d.target, d.target.name === centerName);
        return d.target.y - (dy / dist) * targetRadius;
      });
    };

    // Actualizar posiciones
    if (simulationRef.current) {
      simulationRef.current.on("tick", () => {
        updateLinkPositions();

        if (linkLabels) {
          linkLabels.attr("transform", (d: ExtendedLink) => {
            const x = (d.source.x + d.target.x) / 2;
            const y = (d.source.y + d.target.y) / 2;
            return `translate(${x},${y})`;
          });
        }

        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });
    } else {
      // Layout estático (circular)
      updateLinkPositions();
      if (linkLabels) {
        linkLabels.attr("transform", (d: ExtendedLink) => {
          const x = (d.source.x + d.target.x) / 2;
          const y = (d.source.y + d.target.y) / 2;
          return `translate(${x},${y})`;
        });
      }
    }

    // Guardar referencia al zoom
    (svg as any).zoomBehavior = zoom;
    (svg as any).mainGroup = g;
  }, [data, dimensions, claudioName, centeredNode, onNodeClick, onNodeCenter, isClaudioNode]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

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
