"use client";

import { useState, useMemo } from "react";
import { GAME_VERSIONS, GENERATIONS } from "@/lib/constants/game-versions";
import { getMethodIcon, getMethodLabel, translateCondition } from "@/lib/constants/method-icons";
import type { LocationEncounter } from "@/types/pokemon";

interface Props {
  encounters: LocationEncounter[];
}

export default function LocationTable({ encounters }: Props) {
  const [filterGen, setFilterGen] = useState<number | null>(null);
  const [filterGame, setFilterGame] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState("");
  const [sortBy, setSortBy] = useState<"game" | "location" | "level" | "chance">("game");
  const [sortAsc, setSortAsc] = useState(true);

  // Flatten encounters into rows
  const allRows = useMemo(() => {
    const rows: {
      locationName: string;
      regionName: string;
      versionNameEs: string;
      versionName: string;
      generation: number;
      minLevel: number;
      maxLevel: number;
      avgLevel: number;
      chance: number;
      method: string;
      conditions: string[];
    }[] = [];

    for (const enc of encounters) {
      for (const ver of enc.versions) {
        for (const det of ver.details) {
          rows.push({
            locationName: enc.locationName,
            regionName: enc.regionName,
            versionNameEs: ver.versionNameEs,
            versionName: ver.versionName,
            generation: ver.generation,
            minLevel: det.minLevel,
            maxLevel: det.maxLevel,
            avgLevel: Math.round((det.minLevel + det.maxLevel) / 2),
            chance: det.chance,
            method: det.method,
            conditions: det.conditions,
          });
        }
      }
    }
    return rows;
  }, [encounters]);

  // Filter
  const filtered = useMemo(() => {
    return allRows.filter((row) => {
      if (filterGen && row.generation !== filterGen) return false;
      if (filterGame && !row.versionNameEs.toLowerCase().includes(filterGame.toLowerCase())) return false;
      if (searchLocation && !row.locationName.toLowerCase().includes(searchLocation.toLowerCase())) return false;
      return true;
    });
  }, [allRows, filterGen, filterGame, searchLocation]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "game")     cmp = a.versionNameEs.localeCompare(b.versionNameEs);
      if (sortBy === "location") cmp = a.locationName.localeCompare(b.locationName);
      if (sortBy === "level")    cmp = a.minLevel - b.minLevel;
      if (sortBy === "chance")   cmp = a.chance - b.chance;
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortBy, sortAsc]);

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortAsc((a) => !a);
    else { setSortBy(col); setSortAsc(true); }
  };

  const SortIcon = ({ col }: { col: typeof sortBy }) => (
    <span style={{ opacity: sortBy === col ? 1 : 0.3 }}>
      {sortBy === col ? (sortAsc ? " ↑" : " ↓") : " ↕"}
    </span>
  );

  if (allRows.length === 0) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
      >
        <div className="text-4xl mb-3">🗺️</div>
        <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Sin ubicaciones registradas
        </h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Este Pokémon no aparece en el mundo salvaje o se obtiene por otros métodos
          (evolución, evento, intercambio, etc.)
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
        <h2 className="section-title flex items-center gap-2">
          🗺️ Ubicaciones por Versión del Juego
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {allRows.length} entradas encontradas en {[...new Set(allRows.map((r) => r.versionName))].length} versiones
        </p>
      </div>

      {/* Filters */}
      <div
        className="p-4 border-b flex flex-wrap gap-3"
        style={{ borderColor: "var(--poke-border)", background: "var(--poke-surface-2)" }}
      >
        {/* Search location */}
        <input
          id="location-search"
          type="text"
          placeholder="🔍 Buscar ubicación..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm flex-1 min-w-32"
          style={{
            background: "var(--poke-surface-3)",
            border: "1px solid var(--poke-border)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />

        {/* Gen filter */}
        <select
          id="gen-filter"
          value={filterGen ?? ""}
          onChange={(e) => setFilterGen(e.target.value ? parseInt(e.target.value) : null)}
          className="px-3 py-1.5 rounded-lg text-sm"
          style={{
            background: "var(--poke-surface-3)",
            border: "1px solid var(--poke-border)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        >
          <option value="">Todas las generaciones</option>
          {GENERATIONS.map((g) => (
            <option key={g} value={g}>Generación {g}</option>
          ))}
        </select>

        {/* Game filter */}
        <input
          id="game-filter"
          type="text"
          placeholder="Filtrar juego..."
          value={filterGame}
          onChange={(e) => setFilterGame(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm min-w-32"
          style={{
            background: "var(--poke-surface-3)",
            border: "1px solid var(--poke-border)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />

        {/* Clear filters */}
        {(filterGen || filterGame || searchLocation) && (
          <button
            onClick={() => { setFilterGen(null); setFilterGame(""); setSearchLocation(""); }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ background: "rgba(204,0,0,0.15)", color: "#ff6666", border: "1px solid rgba(204,0,0,0.3)" }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {sorted.length === 0 ? (
          <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
            Sin resultados para los filtros seleccionados
          </div>
        ) : (
          <table className="poke-table" id="locations-table">
            <thead>
              <tr>
                <th>
                  <button onClick={() => handleSort("game")} className="flex items-center gap-1 hover:opacity-80">
                    Juego <SortIcon col="game" />
                  </button>
                </th>
                <th>Gen</th>
                <th>
                  <button onClick={() => handleSort("location")} className="flex items-center gap-1 hover:opacity-80">
                    Ubicación <SortIcon col="location" />
                  </button>
                </th>
                <th>Región</th>
                <th>Método</th>
                <th>
                  <button onClick={() => handleSort("level")} className="flex items-center gap-1 hover:opacity-80">
                    Nivel <SortIcon col="level" />
                  </button>
                </th>
                <th>
                  <button onClick={() => handleSort("chance")} className="flex items-center gap-1 hover:opacity-80">
                    Prob. <SortIcon col="chance" />
                  </button>
                </th>
                <th>Condiciones</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => {
                const gameData = GAME_VERSIONS.find((v) => v.id === row.versionName);
                return (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        {gameData && (
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: gameData.color }}
                          />
                        )}
                        <span className="font-medium text-xs">{row.versionNameEs}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "var(--poke-surface-3)", color: "var(--text-secondary)" }}
                      >
                        G{row.generation}
                      </span>
                    </td>
                    <td className="font-medium">{row.locationName}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{row.regionName}</td>
                    <td>
                      <span
                        className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg"
                        style={{ background: "var(--poke-surface-3)", whiteSpace: "nowrap" }}
                      >
                        <span>{getMethodIcon(row.method)}</span>
                        <span>{getMethodLabel(row.method)}</span>
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs">
                        {row.minLevel === row.maxLevel
                          ? `Nv. ${row.minLevel}`
                          : `Nv. ${row.minLevel}–${row.maxLevel}`}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--poke-surface-3)", minWidth: 40 }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${Math.min(row.chance, 100)}%`,
                              background: row.chance >= 20 ? "#22c55e" : row.chance >= 10 ? "#eab308" : "#ef4444",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
                          {row.chance}%
                        </span>
                      </div>
                    </td>
                    <td>
                      {row.conditions.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {row.conditions.map((c) => (
                            <span
                              key={c}
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: "var(--poke-surface-3)", color: "var(--text-muted)" }}
                            >
                              {translateCondition(c)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="px-6 py-3" style={{ borderTop: "1px solid var(--poke-border)" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Mostrando {sorted.length} de {allRows.length} entradas · Datos de PokéAPI
        </p>
      </div>
    </div>
  );
}
