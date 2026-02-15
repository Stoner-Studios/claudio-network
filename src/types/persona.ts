export interface Relacion {
  nombre: string;
  tipo: string;
  descripcion: string;
}

export interface Persona {
  nombre: string;
  nombre_alternativo: string[];
  relacion: string;
  tipo_relacion: string;
  fuerza_vinculo: number;
  nacionalidad: string;
  origen_etnico: string;
  profesion: string;
  ubicacion: string;
  caracteristicas: string[];
  epoca_relacion: string;
  rol_en_vida_claudio: string;
  num_menciones: number;
  contextos_ejemplo: string[];
  biografia_extendida: string;
  wikipedia_url: string;
  foto_url: string;
  fecha_nacimiento: string;
  fecha_muerte: string;
  lugar_nacimiento: string;
  lugar_muerte: string;
  relaciones_con_otras_personas: Relacion[];
}

export interface DataJson {
  metadata: {
    libro: string;
    autor: string;
    total_personas: number;
    nota: string;
    fecha_limpieza?: string;
    personas_enriquecidas?: number;
    fecha_enriquecimiento?: string;
  };
  personas: Persona[];
}

export interface GraphNode {
  id: string;
  name: string;
  mentions: number;
  hasBio: boolean;
  type: string;
  foto_url?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
}
