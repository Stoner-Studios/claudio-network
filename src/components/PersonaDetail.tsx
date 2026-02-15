"use client";

import { Persona } from "@/types/persona";

interface PersonaDetailProps {
  persona: Persona | null;
  onClose: () => void;
}

export default function PersonaDetail({
  persona,
  onClose,
}: PersonaDetailProps) {
  if (!persona) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      {/* Overlay para móvil */}
      <div className="sm:hidden fixed inset-0 bg-black/50 -z-10" onClick={onClose} />

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{persona.nombre}</h2>
            {persona.nombre_alternativo && persona.nombre_alternativo.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                También conocido como: {persona.nombre_alternativo.join(", ")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stats principales */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{persona.num_menciones}</p>
            <p className="text-xs text-blue-800">Menciones</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-orange-600">{persona.fuerza_vinculo}/10</p>
            <p className="text-xs text-orange-800">Fuerza vínculo</p>
          </div>
        </div>

        {/* Info básica */}
        <div className="space-y-2">
          {persona.tipo_relacion && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Relación:</span>
              <span className="text-sm font-medium text-gray-900 capitalize">{persona.tipo_relacion.replace("_", " ")}</span>
            </div>
          )}
          {persona.nacionalidad && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Nacionalidad:</span>
              <span className="text-sm font-medium text-gray-900">{persona.nacionalidad}</span>
            </div>
          )}
          {persona.profesion && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Profesión:</span>
              <span className="text-sm font-medium text-gray-900">{persona.profesion}</span>
            </div>
          )}
        </div>

        {/* Biografía */}
        {persona.biografia_extendida && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Biografía</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{persona.biografia_extendida}</p>
          </div>
        )}

        {/* Datos biográficos */}
        {(persona.fecha_nacimiento || persona.lugar_nacimiento || persona.fecha_muerte || persona.lugar_muerte) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Datos biográficos</h3>
            <div className="space-y-3">
              {persona.fecha_nacimiento && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Nacimiento</span>
                  <p className="text-sm text-gray-900 font-medium">{persona.fecha_nacimiento}</p>
                  {persona.lugar_nacimiento && (
                    <p className="text-sm text-gray-700">{persona.lugar_nacimiento}</p>
                  )}
                </div>
              )}
              {persona.fecha_muerte && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Fallecimiento</span>
                  <p className="text-sm text-gray-900 font-medium">{persona.fecha_muerte}</p>
                  {persona.lugar_muerte && (
                    <p className="text-sm text-gray-700">{persona.lugar_muerte}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rol en vida de Claudio */}
        {persona.rol_en_vida_claudio && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-1">Rol en vida de Claudio</h4>
            <p className="text-sm text-gray-700">{persona.rol_en_vida_claudio}</p>
          </div>
        )}

        {/* Características */}
        {persona.caracteristicas && persona.caracteristicas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Características</h4>
            <div className="flex flex-wrap gap-2">
              {persona.caracteristicas.map((caract, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {caract}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Relaciones */}
        {persona.relaciones_con_otras_personas && persona.relaciones_con_otras_personas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Relaciones ({persona.relaciones_con_otras_personas.length})
            </h3>
            <div className="space-y-2">
              {persona.relaciones_con_otras_personas.map((rel, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <p className="text-sm font-medium text-gray-900">{rel.nombre}</p>
                  <p className="text-xs text-gray-600">{rel.tipo}</p>
                  {rel.descripcion && (
                    <p className="text-xs text-gray-700 mt-1">{rel.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enlaces externos */}
        {persona.wikipedia_url && (
          <div className="pt-4 border-t border-gray-200">
            <a
              href={persona.wikipedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver más información
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
