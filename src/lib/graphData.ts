import data from "@/data/personas.json";
import { Persona, DataJson, GraphNode, GraphLink } from "@/types/persona";

export function getData(): DataJson {
  return data as DataJson;
}

export function getPersonas(): Persona[] {
  return (data as DataJson).personas;
}

export function getTopPersonas(limit: number = 50): Persona[] {
  return getPersonas()
    .sort((a, b) => b.num_menciones - a.num_menciones)
    .slice(0, limit);
}

export function getPersonasWithBio(): Persona[] {
  return getPersonas().filter((p) => p.biografia_extendida && p.biografia_extendida.length > 0);
}

export function getPersonasWithRelations(): Persona[] {
  return getPersonas().filter(
    (p) =>
      p.relaciones_con_otras_personas &&
      p.relaciones_con_otras_personas.length > 0
  );
}

export function getRelationTypes(): string[] {
  const tipos = new Set<string>();
  getPersonas().forEach((p) => {
    if (p.tipo_relacion) {
      tipos.add(p.tipo_relacion);
    }
  });
  return Array.from(tipos).sort();
}

export function getClaudioPersona(): Persona | undefined {
  return getPersonas().find(
    (p) => p.nombre === "Claudio Naranjo" || p.nombre.includes("Claudio")
  );
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const CLAUDIO_NODO: GraphNode = {
  id: "Claudio Naranjo",
  name: "Claudio Naranjo",
  mentions: 999, // Valor alto para que siempre sea visible
  hasBio: true,
  type: "autor",
};

export function buildGraphData(minMentions: number = 10): GraphData {
  const personas = getPersonas();
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, boolean>();

  // Siempre incluir a Claudio como nodo central
  nodes.push(CLAUDIO_NODO);
  nodeMap.set("Claudio Naranjo", true);

  // Crear nodos para personas con menciones >= minMentions (excluyendo a Claudio)
  const filteredPersonas = personas.filter(
    (p) => p.num_menciones >= minMentions && p.nombre !== "Claudio Naranjo"
  );

  filteredPersonas.forEach((p) => {
    nodeMap.set(p.nombre, true);
    nodes.push({
      id: p.nombre,
      name: p.nombre,
      mentions: p.num_menciones,
      hasBio: !!p.biografia_extendida,
      type: p.tipo_relacion,
    });
  });

  // Crear links entre nodos que existen
  filteredPersonas.forEach((p) => {
    if (p.relaciones_con_otras_personas) {
      p.relaciones_con_otras_personas.forEach((rel) => {
        if (nodeMap.has(rel.nombre)) {
          links.push({
            source: p.nombre,
            target: rel.nombre,
            type: rel.tipo,
          });
        }
      });
    }

    // Crear link de Claudio a cada persona (Claudio es el autor que menciona)
    links.push({
      source: "Claudio Naranjo",
      target: p.nombre,
      type: p.tipo_relacion,
    });
  });

  return { nodes, links };
}

export function buildFullGraphData(): GraphData {
  const personas = getPersonasWithRelations();
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, boolean>();

  // Crear nodos para todas las personas con relaciones
  personas.forEach((p) => {
    if (!nodeMap.has(p.nombre)) {
      nodeMap.set(p.nombre, true);
      nodes.push({
        id: p.nombre,
        name: p.nombre,
        mentions: p.num_menciones,
        hasBio: !!p.biografia_extendida,
        type: p.tipo_relacion,
      });
    }

    // Añadir nodos para las personas relacionadas
    if (p.relaciones_con_otras_personas) {
      p.relaciones_con_otras_personas.forEach((rel) => {
        if (!nodeMap.has(rel.nombre)) {
          nodeMap.set(rel.nombre, true);
          // Buscar la persona relacionada para obtener sus datos
          const relatedPerson = personas.find((rp) => rp.nombre === rel.nombre);
          nodes.push({
            id: rel.nombre,
            name: rel.nombre,
            mentions: relatedPerson?.num_menciones || 1,
            hasBio: !!relatedPerson?.biografia_extendida,
            type: relatedPerson?.tipo_relacion || "relacionado",
          });
        }

        // Crear el link
        links.push({
          source: p.nombre,
          target: rel.nombre,
          type: rel.tipo,
        });
      });
    }
  });

  return { nodes, links };
}

export const relationTypeColors: Record<string, string> = {
  maestro: "#ef4444", // red
  maestro_espiritual: "#ef4444",
  discipulo: "#f97316", // orange
  alumno: "#f97316",
  estudiante: "#f97316",
  amigo: "#22c55e", // green
  amigo_familia: "#22c55e",
  pareja: "#ec4899", // pink
  esposa: "#ec4899",
  hijo: "#ec4899",
  hija: "#ec4899",
  familiar: "#8b5cf6", // purple
  tío: "#8b5cf6",
  colaborador: "#06b6d4", // cyan
  colega: "#06b6d4",
  promotor: "#eab308", // yellow
  mentor: "#f59e0b", // amber
  influencia: "#6366f1", // indigo
  anfitriona: "#14b8a6", // teal
  referencia: "#64748b", // slate
  conocido: "#64748b",
  default: "#94a3b8", // gray
};

export function getRelationColor(type: string): string {
  const normalizedType = type.toLowerCase().trim();
  return relationTypeColors[normalizedType] || relationTypeColors.default;
}
