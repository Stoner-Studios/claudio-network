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
  foto_url: "/images/personas/Claudio_Naranjo.jpg",
};

export interface GraphFilters {
  search?: string;
  tipoRelacion?: string;
  minFuerza?: number;
  maxFuerza?: number;
  conBio?: boolean | null;
  conRelaciones?: boolean | null;
}

export function buildGraphData(filters: GraphFilters = {}): GraphData {
  const {
    search = "",
    tipoRelacion = "",
    minFuerza = 1,
    maxFuerza = 10,
    conBio = null,
    conRelaciones = null,
  } = filters;

  const personas = getPersonas();
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeMap = new Map<string, boolean>();

  // Determinar si hay búsqueda activa
  const hasActiveSearch = search && search.trim().length > 0;

  // Siempre incluir a Claudio como nodo central
  // - Sin búsqueda: es el centro del grafo
  // - Con búsqueda: sirve como conector para mostrar las líneas de relación
  nodes.push(CLAUDIO_NODO);
  nodeMap.set("Claudio Naranjo", true);

  // Filtrar personas según todos los criterios
  const filteredPersonas = personas.filter((p) => {
    // Excluir a Claudio del filtrado normal (ya se añadió arriba si corresponde)
    if (p.nombre === "Claudio Naranjo") return false;

    // Filtro de búsqueda en TODOS los campos de texto (igual que SidePanel)
    if (hasActiveSearch) {
      const searchLower = search.toLowerCase();
      const searchFields = [
        p.nombre,
        p.profesion,
        p.nacionalidad,
        p.relacion,
        p.tipo_relacion,
        p.ubicacion,
        p.rol_en_vida_claudio,
        p.biografia_extendida,
        ...(p.caracteristicas || []),
        ...(p.contextos_ejemplo || []),
        ...(p.nombre_alternativo || []),
      ].filter(Boolean);

      const matchesAnyField = searchFields.some(field =>
        field?.toLowerCase().includes(searchLower)
      );

      if (!matchesAnyField) return false;
    }

    // Filtro por tipo de relación
    if (tipoRelacion && p.tipo_relacion !== tipoRelacion) return false;

    // Filtro por fuerza mínima
    if ((p.fuerza_vinculo || 1) < minFuerza) return false;

    // Filtro por fuerza máxima
    if ((p.fuerza_vinculo || 1) > maxFuerza) return false;

    // Filtro por biografía
    if (conBio === true && !p.biografia_extendida) return false;

    // Filtro por relaciones
    if (conRelaciones === true && (!p.relaciones_con_otras_personas || p.relaciones_con_otras_personas.length === 0)) {
      return false;
    }

    return true;
  });

  filteredPersonas.forEach((p) => {
    nodeMap.set(p.nombre, true);
    nodes.push({
      id: p.nombre,
      name: p.nombre,
      mentions: p.num_menciones,
      hasBio: !!p.biografia_extendida,
      type: p.tipo_relacion,
      foto_url: p.foto_url || undefined,
      fuerza_vinculo: p.fuerza_vinculo || 1,
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
      fuerza_vinculo: p.fuerza_vinculo || 1,
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

// Relaciones bidireccionales (flecha doble en ambos extremos)
// Estas relaciones son recíprocas por naturaleza
export const bidirectionalRelations: Set<string> = new Set([
  "amigo",
  "amigo_familia",
  "pareja",
  "esposa",
  "esposo",
  "colega",
  "colaborador",
  "familiar",
  "hermano",
  "hermana",
  "primo",
  "prima",
  "tio",
  "tia",
  "tío",
  "tía",
]);

// Relaciones unidireccionales (flecha en un solo sentido)
// source -> target: source es el sujeto, target es el objeto
// Ejemplo: "maestro" con source=Maestro, target=Alumno significa Maestro enseña a Alumno
export const unidirectionalRelations: Set<string> = new Set([
  "maestro",
  "maestro_espiritual",
  "mentor",
  "discipulo",
  "alumno",
  "estudiante",
  "hijo",
  "hija",
  "padre",
  "madre",
  "promotor",
  "influencia",
  "anfitriona",
  "referencia",
  "conocido",
]);

export function isBidirectional(type: string): boolean {
  const normalizedType = type.toLowerCase().trim();
  return bidirectionalRelations.has(normalizedType);
}
