"use client";

import { useState, useMemo, useCallback } from "react";
import NetworkGraph from "@/components/NetworkGraph";
import PersonaDetail from "@/components/PersonaDetail";
import SidePanel, { FilterState } from "@/components/SidePanel";
import { getData, buildGraphData, getRelationTypes, relationTypeColors, GraphFilters } from "@/lib/graphData";
import { Persona, GraphNode } from "@/types/persona";

export default function Home() {
  const data = getData();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [centeredNodeName, setCenteredNodeName] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tipoRelacion: "",
    minFuerza: 5,
    maxFuerza: 10,
    conBio: null,
    conRelaciones: null,
  });

  // Construir datos del grafo basados en filtros
  const graphData = useMemo(() => {
    return buildGraphData({
      search: filters.search,
      tipoRelacion: filters.tipoRelacion,
      minFuerza: filters.minFuerza,
      maxFuerza: filters.maxFuerza,
      conBio: filters.conBio,
      conRelaciones: filters.conRelaciones,
    });
  }, [filters]);

  // Obtener tipos de relación únicos presentes en el grafo actual
  const activeRelationTypes = useMemo(() => {
    const types = new Set<string>();
    graphData.links.forEach(link => {
      if (link.type) types.add(link.type.toLowerCase());
    });
    return Array.from(types).sort();
  }, [graphData.links]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    const persona = data.personas.find((p) => p.nombre === node.id || p.nombre === node.name);
    if (persona) {
      setSelectedPersona(persona);
    }
  }, [data.personas]);

  const handleNodeCenter = useCallback((node: GraphNode) => {
    setCenteredNodeName(node.name || node.id);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100">
      {/* Header minimalista - Responsive - Always visible */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between z-[60] relative">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Claudio Network
          </h1>
          <span className="text-xs text-gray-500 hidden md:block">
            Red de relaciones de &ldquo;Ascenso y Descenso de la Montaña Sagrada&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Buscador de personas */}
          <div className="relative flex items-center">
            <svg
              className="absolute left-2.5 w-4 h-4 text-gray-400 pointer-events-none flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              style={{ paddingLeft: '28px' }}
              className="w-24 sm:w-36 h-8 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Control de fuerza mínima - Visible en todos los tamaños */}
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <label className="text-gray-600 text-xs sm:text-sm font-medium">Fza:</label>
            <input
              type="range"
              min="1"
              max="10"
              value={filters.minFuerza}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minFuerza: Number(e.target.value),
                }))
              }
              className="w-16 sm:w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              type="number"
              min="1"
              max="10"
              value={filters.minFuerza}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minFuerza: Math.min(10, Math.max(1, Number(e.target.value) || 1)),
                }))
              }
              className="w-10 sm:w-12 px-1 sm:px-2 py-1 border border-gray-300 rounded text-center font-bold text-blue-600 text-sm"
            />
          </div>

          {/* Botón toggle para panel */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isPanelOpen
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isPanelOpen ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline">Cerrar</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                <span className="hidden sm:inline">Listado</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Área principal - Grafo a pantalla completa */}
      <main className="flex-1 relative">
        <NetworkGraph
          data={graphData}
          onNodeClick={handleNodeClick}
          onNodeCenter={handleNodeCenter}
          claudioName="Claudio Naranjo"
          centeredNode={centeredNodeName}
        />

        {/* Leyenda flotante con desplegable - Oculta en móvil */}
        <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg z-20 border border-gray-200">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-semibold text-gray-800"
          >
            <span>Leyenda</span>
            <svg
              className={`w-4 h-4 transition-transform ${showLegend ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showLegend && (
            <div className="px-4 pb-4 space-y-3">
              {/* Nodos */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-300" />
                  <span className="text-gray-800 font-medium">Centro (Claudio Naranjo)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-700">Persona en la red</span>
                </div>
              </div>

              {/* Tipos de relación */}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-gray-700 font-medium mb-2 text-sm">Tipos de relación:</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
                  {activeRelationTypes.map((type) => {
                    const color = relationTypeColors[type] || relationTypeColors.default;
                    return (
                      <div key={type} className="flex items-center gap-2">
                        <div
                          className="w-5 h-0.5 rounded"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-gray-700 text-xs capitalize">{type.replace(/_/g, ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Flechas */}
              <div className="border-t border-gray-200 pt-3 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-3" viewBox="0 0 24 12">
                    <line x1="0" y1="6" x2="18" y2="6" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="18,2 24,6 18,10" fill="#94a3b8" />
                  </svg>
                  <span className="text-gray-700">Unidireccional</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-3" viewBox="0 0 24 12">
                    <polygon points="6,2 0,6 6,10" fill="#94a3b8" />
                    <line x1="6" y1="6" x2="18" y2="6" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="18,2 24,6 18,10" fill="#94a3b8" />
                  </svg>
                  <span className="text-gray-700">Bidireccional</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats flotantes - Compacto en todos los tamaños */}
        <div className="absolute bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow p-2 sm:p-3 z-20 border border-gray-200">
          <div className="flex gap-2 sm:gap-4 text-xs">
            <div className="text-center px-1">
              <p className="font-bold text-sm sm:text-lg text-gray-900">{data.personas.length}</p>
              <p className="text-gray-500 hidden sm:block">Personas</p>
            </div>
            <div className="text-center px-1">
              <p className="font-bold text-sm sm:text-lg text-purple-600">{graphData.nodes.length}</p>
              <p className="text-gray-500 hidden sm:block">En grafo</p>
            </div>
          </div>
        </div>

        {/* Instrucciones - Ocultas en móvil */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full z-20">
          Arrastra para mover • Scroll para zoom • Click en nodo para detalles y centrar
        </div>
      </main>

      {/* Panel lateral */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSelectPersona={(persona) => {
          setSelectedPersona(persona);
          setCenteredNodeName(persona.nombre);
        }}
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      {/* Modal de detalle */}
      {selectedPersona && (
        <PersonaDetail
          persona={selectedPersona}
          onClose={() => setSelectedPersona(null)}
          onNavigateToPersona={(persona) => {
            setSelectedPersona(persona);
            setCenteredNodeName(persona.nombre);
          }}
        />
      )}
    </div>
  );
}
