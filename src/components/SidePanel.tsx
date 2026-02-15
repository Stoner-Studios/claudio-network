"use client";

import { useMemo } from "react";
import { Persona } from "@/types/persona";
import { getData, getPersonas, getRelationTypes } from "@/lib/graphData";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPersona: (persona: Persona) => void;
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  search: string;
  tipoRelacion: string;
  minMenciones: number;
  maxMenciones: number;
  conBio: boolean | null;
  conRelaciones: boolean | null;
}

export default function SidePanel({
  isOpen,
  onClose,
  onSelectPersona,
  onFilterChange,
  filters,
}: SidePanelProps) {
  const data = getData();
  const tiposRelacion = getRelationTypes();

  // Filtrar personas basado en los filtros del padre
  const filteredPersonas = useMemo(() => {
    const personas = getPersonas();
    return personas.filter((p) => {
      // Filtro de búsqueda
      if (
        filters.search &&
        !p.nombre.toLowerCase().includes(filters.search.toLowerCase()) &&
        !p.profesion?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Filtro por tipo de relación
      if (filters.tipoRelacion && p.tipo_relacion !== filters.tipoRelacion) {
        return false;
      }

      // Filtro por menciones mínimas
      if (p.num_menciones < filters.minMenciones) {
        return false;
      }

      // Filtro por menciones máximas
      if (p.num_menciones > filters.maxMenciones) {
        return false;
      }

      // Filtro por biografía
      if (filters.conBio === true && !p.biografia_extendida) {
        return false;
      }

      // Filtro por relaciones
      if (
        filters.conRelaciones === true &&
        (!p.relaciones_con_otras_personas ||
          p.relaciones_con_otras_personas.length === 0)
      ) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    onFilterChange({ ...filters, ...newFilters });
  };

  const stats = useMemo(() => {
    const total = data.personas.length;
    const withBio = data.personas.filter(
      (p) => p.biografia_extendida && p.biografia_extendida.length > 0
    ).length;
    const withRelations = data.personas.filter(
      (p) =>
        p.relaciones_con_otras_personas &&
        p.relaciones_con_otras_personas.length > 0
    ).length;
    return { total, withBio, withRelations };
  }, [data]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay para móvil - negro translúcido elegante */}
      <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-0 sm:inset-y-0 sm:right-0 sm:w-96 bg-white shadow-2xl z-50 flex flex-col sm:border-l border-gray-200 rounded-t-3xl sm:rounded-none">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-3xl sm:rounded-none">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Personas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-3 text-xs">
          <div className="bg-white px-3 py-2 rounded-lg border">
            <span className="font-bold text-gray-900">{stats.total}</span>
            <span className="text-gray-700 ml-1">total</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border">
            <span className="font-bold text-blue-600">{stats.withBio}</span>
            <span className="text-gray-700 ml-1">con bio</span>
          </div>
          <div className="bg-white px-3 py-2 rounded-lg border">
            <span className="font-bold text-green-600">{stats.withRelations}</span>
            <span className="text-gray-700 ml-1">con rel.</span>
          </div>
        </div>
        </div>

      {/* Filtros */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        {/* Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o profesión..."
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 placeholder-gray-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Tipo de relación */}
        <select
          value={filters.tipoRelacion}
          onChange={(e) => handleFilterChange({ tipoRelacion: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="">Todos los tipos de relación</option>
          {tiposRelacion.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo.replace("_", " ")}
            </option>
          ))}
        </select>

        {/* Menciones */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-800">
            Menciones: {filters.minMenciones} - {filters.maxMenciones === 1000 ? "∞" : filters.maxMenciones}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={filters.minMenciones}
              onChange={(e) =>
                handleFilterChange({ minMenciones: Number(e.target.value) || 1 })
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Máx"
              value={filters.maxMenciones === 1000 ? "" : filters.maxMenciones}
              onChange={(e) =>
                handleFilterChange({
                  maxMenciones: Number(e.target.value) || 1000,
                })
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Toggle filters */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              handleFilterChange({
                conBio: filters.conBio === true ? null : true,
              })
            }
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              filters.conBio === true
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Solo con biografía
          </button>
          <button
            onClick={() =>
              handleFilterChange({
                conRelaciones: filters.conRelaciones === true ? null : true,
              })
            }
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              filters.conRelaciones === true
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Solo con relaciones
          </button>
        </div>

        {/* Contador de resultados */}
        <div className="text-sm text-gray-700 font-medium">
          Mostrando <span className="text-blue-600">{filteredPersonas.length}</span> de {stats.total} personas
        </div>
      </div>

      {/* Lista de personas */}
      <div className="flex-1 overflow-y-auto">
        {filteredPersonas.length === 0 ? (
          <div className="p-4 text-center text-gray-700 text-sm">
            No se encontraron personas con estos filtros
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredPersonas
              .sort((a, b) => b.num_menciones - a.num_menciones)
              .map((persona) => (
                <button
                  key={persona.nombre}
                  onClick={() => onSelectPersona(persona)}
                  className="w-full p-3 text-left hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {persona.nombre}
                      </h3>
                      <p className="text-sm text-gray-700 mt-0.5 capitalize">
                        {persona.tipo_relacion.replace("_", " ")}
                      </p>
                      {persona.profesion && (
                        <p className="text-sm text-gray-600 mt-0.5 truncate">
                          {persona.profesion}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-2">
                      <span className="text-sm font-bold text-blue-600">
                        {persona.num_menciones}
                      </span>
                      <div className="flex gap-1">
                        {persona.biografia_extendida && (
                          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" title="Tiene biografía" />
                        )}
                        {persona.relaciones_con_otras_personas?.length > 0 && (
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Tiene relaciones" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
