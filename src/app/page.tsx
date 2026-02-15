"use client";

import { useState, useMemo, useCallback } from "react";
import NetworkGraph from "@/components/NetworkGraph";
import PersonaDetail from "@/components/PersonaDetail";
import SidePanel, { FilterState } from "@/components/SidePanel";
import { getData, buildGraphData } from "@/lib/graphData";
import { Persona, GraphNode } from "@/types/persona";

export default function Home() {
  const data = getData();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tipoRelacion: "",
    minMenciones: 1,
    maxMenciones: 1000,
    conBio: null,
    conRelaciones: null,
  });

  // Construir datos del grafo basados en filtros
  const graphData = useMemo(() => {
    return buildGraphData(filters.minMenciones);
  }, [filters.minMenciones]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    const persona = data.personas.find((p) => p.nombre === node.id);
    if (persona) {
      setSelectedPersona(persona);
    }
  }, [data.personas]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100">
      {/* Header minimalista - Responsive */}
      <header className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Claudio Network
          </h1>
          <span className="text-xs text-gray-500 hidden md:block">
            Red de relaciones de &ldquo;Ascenso y Descenso de la Montaña Sagrada&rdquo;
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Control de menciones mínimas - Oculto en móvil muy pequeño */}
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <label className="text-gray-600 hidden md:inline">Menciones mín.:</label>
            <label className="text-gray-600 md:hidden">Min.:</label>
            <input
              type="range"
              min="1"
              max="50"
              value={filters.minMenciones}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  minMenciones: Number(e.target.value),
                }))
              }
              className="w-16 sm:w-20"
            />
            <span className="font-medium text-blue-600 w-6">
              {filters.minMenciones}
            </span>
          </div>

          {/* Botón para abrir panel */}
          <button
            onClick={() => setIsPanelOpen(true)}
            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="hidden sm:inline">Listado</span>
          </button>
        </div>
      </header>

      {/* Área principal - Grafo a pantalla completa */}
      <main className="flex-1 relative">
        <NetworkGraph
          data={graphData}
          onNodeClick={handleNodeClick}
          claudioName="Claudio Naranjo"
        />

        {/* Leyenda flotante - Oculta en móvil */}
        <div className="hidden md:block absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 z-20 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Leyenda</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-300" />
              <span className="text-gray-800 font-medium">Claudio Naranjo (centro)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-gray-700">Con biografía</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span className="text-gray-700">Sin biografía</span>
            </div>
            <div className="border-t border-gray-200 my-3 pt-3">
              <p className="text-gray-700 font-medium mb-2">Tipos de relación:</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-red-500 rounded" />
                  <span className="text-gray-700">Maestro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-green-500 rounded" />
                  <span className="text-gray-700">Amigo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-pink-500 rounded" />
                  <span className="text-gray-700">Pareja</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 bg-purple-500 rounded" />
                  <span className="text-gray-700">Familia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats flotantes - Versión compacta en móvil */}
        <div className="absolute bottom-16 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow p-2 sm:p-3 z-20 border border-gray-200">
          <div className="flex gap-2 sm:gap-4 text-xs">
            <div className="text-center px-1 sm:px-2">
              <p className="font-bold text-base sm:text-lg text-gray-900">{data.personas.length}</p>
              <p className="text-gray-500 hidden sm:block">Personas</p>
            </div>
            <div className="text-center px-1 sm:px-2">
              <p className="font-bold text-base sm:text-lg text-blue-600">
                {data.personas.filter((p) => p.biografia_extendida).length}
              </p>
              <p className="text-gray-500 hidden sm:block">Con bio</p>
            </div>
            <div className="text-center px-1 sm:px-2">
              <p className="font-bold text-base sm:text-lg text-green-600">
                {data.personas.filter((p) => p.relaciones_con_otras_personas?.length > 0).length}
              </p>
              <p className="text-gray-500 hidden sm:block">Con rel.</p>
            </div>
            <div className="text-center px-1 sm:px-2">
              <p className="font-bold text-base sm:text-lg text-purple-600">{graphData.nodes.length}</p>
              <p className="text-gray-500 hidden sm:block">En grafo</p>
            </div>
          </div>
        </div>

        {/* Instrucciones - Ocultas en móvil */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full z-20">
          Arrastra para mover • Scroll para zoom • Click en nodo para detalles
        </div>
      </main>

      {/* Panel lateral */}
      <SidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSelectPersona={(persona) => {
          setSelectedPersona(persona);
          setIsPanelOpen(false);
        }}
        onFilterChange={handleFilterChange}
        filters={filters}
      />

      {/* Modal de detalle */}
      {selectedPersona && (
        <PersonaDetail
          persona={selectedPersona}
          onClose={() => setSelectedPersona(null)}
        />
      )}
    </div>
  );
}
