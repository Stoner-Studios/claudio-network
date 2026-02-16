"use client";

import { Persona } from "@/types/persona";
import { getData } from "@/lib/graphData";

interface PersonaDetailProps {
  persona: Persona | null;
  onClose: () => void;
  onNavigateToPersona?: (persona: Persona) => void;
}

// Helper function to calculate age at death
function calculateAge(birth: string, death: string): number | null {
  try {
    const birthYear = parseInt(birth.split('-')[0]);
    const deathYear = parseInt(death.split('-')[0]);
    if (isNaN(birthYear) || isNaN(deathYear)) return null;
    return deathYear - birthYear;
  } catch {
    return null;
  }
}

// Helper to format date for display
function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.length === 4) return dateStr;

  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export default function PersonaDetail({
  persona,
  onClose,
  onNavigateToPersona,
}: PersonaDetailProps) {
  if (!persona) return null;

  const data = getData();

  // Find persona by name for navigation
  const findPersonaByName = (name: string): Persona | undefined => {
    return data.personas.find(p =>
      p.nombre === name ||
      p.nombre_alternativo?.includes(name)
    );
  };

  // Handle clicking on a related person
  const handleRelationClick = (relationName: string) => {
    const relatedPersona = findPersonaByName(relationName);
    if (relatedPersona && onNavigateToPersona) {
      onNavigateToPersona(relatedPersona);
    }
  };

  // Calculate age at death if we have both dates
  const ageAtDeath = persona.fecha_nacimiento && persona.fecha_muerte
    ? calculateAge(persona.fecha_nacimiento, persona.fecha_muerte)
    : null;

  return (
    <>
      {/* Overlay para móvil - negro translúcido elegante */}
      <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel - starts below header on desktop */}
      <div className="fixed inset-0 sm:top-[57px] sm:bottom-0 sm:left-auto sm:right-0 sm:w-96 bg-white shadow-2xl z-50 flex flex-col sm:border-l border-gray-200 rounded-t-3xl sm:rounded-none">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-3xl sm:rounded-none">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Foto de perfil */}
            {persona.foto_url ? (
              <img
                src={persona.foto_url}
                alt={persona.nombre}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-gray-400">
                  {persona.nombre.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">{persona.nombre}</h2>
              {persona.nombre_alternativo && persona.nombre_alternativo.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  También conocido como: {persona.nombre_alternativo.join(", ")}
                </p>
              )}
            </div>
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

        {/* Contextos del libro */}
        {persona.contextos_ejemplo && persona.contextos_ejemplo.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Menciones en el libro
            </h3>
            <div className="space-y-2">
              {persona.contextos_ejemplo.map((contexto, i) => (
                <div
                  key={i}
                  className="p-3 bg-amber-50 border-l-3 border-amber-400 rounded-r-lg"
                >
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    &ldquo;{contexto}...&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Datos biográficos */}
        {(persona.fecha_nacimiento || persona.lugar_nacimiento || persona.fecha_muerte || persona.lugar_muerte) && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Datos biográficos
              {ageAtDeath !== null && (
                <span className="ml-2 text-orange-600 font-normal">({ageAtDeath} años)</span>
              )}
            </h3>
            <div className="space-y-3">
              {persona.fecha_nacimiento && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Nacimiento</span>
                  <p className="text-sm text-gray-900 font-medium">{formatDate(persona.fecha_nacimiento)}</p>
                  {persona.lugar_nacimiento && (
                    <p className="text-sm text-gray-700">{persona.lugar_nacimiento}</p>
                  )}
                </div>
              )}
              {persona.fecha_muerte && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-700">Fallecimiento</span>
                  <p className="text-sm text-gray-900 font-medium">{formatDate(persona.fecha_muerte)}</p>
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

        {/* Relaciones clicables */}
        {persona.relaciones_con_otras_personas && persona.relaciones_con_otras_personas.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Relaciones ({persona.relaciones_con_otras_personas.length})
            </h3>
            <div className="space-y-2">
              {persona.relaciones_con_otras_personas.map((rel, i) => {
                const relatedPersona = findPersonaByName(rel.nombre);
                const isClickable = relatedPersona && onNavigateToPersona;

                return (
                  <button
                    key={i}
                    onClick={() => isClickable && handleRelationClick(rel.nombre)}
                    disabled={!isClickable}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      isClickable
                        ? 'bg-gray-50 hover:bg-blue-50 cursor-pointer'
                        : 'bg-gray-50 cursor-default'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${isClickable ? 'text-blue-700' : 'text-gray-900'}`}>
                          {rel.nombre}
                          {isClickable && (
                            <svg className="inline-block w-4 h-4 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </p>
                        <p className="text-xs text-gray-600">{rel.tipo}</p>
                        {rel.descripcion && (
                          <p className="text-xs text-gray-700 mt-1">{rel.descripcion}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
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
    </>
  );
}
