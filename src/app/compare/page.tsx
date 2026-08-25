"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { TYPE_COLORS, TYPE_NAMES_ES } from "@/lib/constants/type-colors";
import { formatPokemonName, formatPokedexNumber, getStatColor } from "@/lib/utils/formatters";

interface PokemonCompareData {
  id: number;
  name: string;
  nameEs: string;
  types: string[];
  sprites: { official: string | null };
  stats: {
    hp: number; attack: number; defense: number;
    specialAttack: number; specialDefense: number; speed: number; total: number;
  };
  typeEffectiveness: {
    immune: string[]; quarter: string[]; half: string[];
    neutral: string[]; double: string[]; quadruple: string[];
  };
}

const STAT_LABELS = [
  { key: "hp",             label: "PS" },
  { key: "attack",         label: "Ataque" },
  { key: "defense",        label: "Defensa" },
  { key: "specialAttack",  label: "At. Esp." },
  { key: "specialDefense", label: "Def. Esp." },
  { key: "speed",          label: "Velocidad" },
  { key: "total",          label: "TOTAL" },
];

const STAT_MAX: Record<string, number> = {
  hp: 255, attack: 190, defense: 250, specialAttack: 194,
  specialDefense: 250, speed: 200, total: 1125,
};

function PokemonSelector({
  label, value, onSelect, allPokemon,
}: {
  label: string;
  value: PokemonCompareData | null;
  onSelect: (name: string) => void;
  allPokemon: { name: string; id: number }[];
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ name: string; id: number }[]>([]);
  const [show, setShow] = useState(false);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) { setSuggestions([]); setShow(false); return; }
    const lower = q.toLowerCase();
    setSuggestions(
      allPokemon.filter((p) => p.name.includes(lower) || String(p.id).includes(lower)).slice(0, 6)
    );
    setShow(true);
  };

  const select = (name: string) => {
    setQuery("");
    setShow(false);
    onSelect(name);
  };

  return (
    <div className="flex-1 min-w-64">
      <div className="relative">
        <input
          type="search"
          placeholder={`🔍 ${label}...`}
          value={query}
          onChange={(e) => search(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "var(--poke-surface)",
            border: "1px solid var(--poke-border)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        {show && suggestions.length > 0 && (
          <div
            className="absolute top-full mt-1 left-0 right-0 rounded-xl overflow-hidden z-40 shadow-2xl"
            style={{ background: "var(--poke-surface-2)", border: "1px solid var(--poke-border)" }}
          >
            {suggestions.map((p) => (
              <button
                key={p.name}
                onClick={() => select(p.name)}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-opacity-50"
                style={{ color: "var(--text-primary)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                  alt="" width={32} height={32} className="w-8 h-8 object-contain" />
                <span className="flex-1 font-medium">{formatPokemonName(p.name)}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{formatPokedexNumber(p.id)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected preview */}
      {value && (
        <div
          className="mt-3 p-4 rounded-xl flex flex-col items-center gap-2"
          style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
        >
          {value.sprites.official && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.sprites.official} alt={value.nameEs}
              width={96} height={96} className="w-24 h-24 object-contain float-animation" />
          )}
          <div className="text-center">
            <div className="font-black text-lg" style={{ color: "var(--text-primary)", fontFamily: "Outfit,sans-serif" }}>
              {value.nameEs}
            </div>
            <div className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              {formatPokedexNumber(value.id)}
            </div>
            <div className="flex gap-1 justify-center flex-wrap">
              {value.types.map((t) => (
                <span key={t} className="type-badge" style={{ background: TYPE_COLORS[t]?.hex ?? "#888", color: "white" }}>
                  {TYPE_NAMES_ES[t] ?? t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [pokemon1, setPokemon1] = useState<PokemonCompareData | null>(null);
  const [pokemon2, setPokemon2] = useState<PokemonCompareData | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    fetch("/api/search").then(r => r.json()).then(d => setAllPokemon(d.pokemon ?? []));
  }, []);

  const loadPokemon = useCallback(async (name: string, slot: 1 | 2) => {
    const setLoading = slot === 1 ? setLoading1 : setLoading2;
    const setPokemon = slot === 1 ? setPokemon1 : setPokemon2;
    setLoading(true);
    try {
      const res = await fetch(`/api/pokemon/${name}`);
      const data = await res.json();
      setPokemon(data);
    } catch {}
    setLoading(false);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b px-4 py-4"
        style={{ background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)", borderColor: "var(--poke-border)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Link href="/" style={{ color: "var(--poke-red)", fontWeight: 800, fontSize: "1.25rem", fontFamily: "Outfit,sans-serif", textDecoration: "none" }}>
            ← PokéDex Pro
          </Link>
          <h1 className="text-xl font-black" style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}>
            Comparar Pokémon
          </h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Selectors */}
        <div className="flex flex-wrap gap-4 items-start" id="compare-selectors">
          <PokemonSelector label="Primer Pokémon" value={pokemon1} onSelect={(n) => loadPokemon(n, 1)} allPokemon={allPokemon} />
          <div className="flex items-center justify-center pt-12 text-3xl font-black" style={{ color: "var(--text-muted)" }}>
            VS
          </div>
          <PokemonSelector label="Segundo Pokémon" value={pokemon2} onSelect={(n) => loadPokemon(n, 2)} allPokemon={allPokemon} />
        </div>

        {/* Comparison table */}
        {pokemon1 && pokemon2 && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
            id="compare-stats"
          >
            <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
              <h2 className="section-title">📊 Comparación de Estadísticas</h2>
            </div>

            <div className="p-6 space-y-4">
              {STAT_LABELS.map(({ key, label }) => {
                const v1 = pokemon1.stats[key as keyof typeof pokemon1.stats] as number;
                const v2 = pokemon2.stats[key as keyof typeof pokemon2.stats] as number;
                const max = STAT_MAX[key] ?? 255;
                const winner = v1 > v2 ? 1 : v2 > v1 ? 2 : 0;

                return (
                  <div key={key} className="grid grid-cols-[1fr,80px,1fr] gap-2 items-center">
                    {/* P1 bar */}
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`text-sm font-bold ${winner === 1 ? "text-green-400" : ""}`}
                        style={{ color: winner === 1 ? "#4ade80" : "var(--text-primary)" }}>
                        {v1}
                      </span>
                      <div className="w-28 sm:w-40 h-2 rounded-full flex justify-end"
                        style={{ background: "var(--poke-surface-3)" }}>
                        <div className="h-2 rounded-full"
                          style={{ width: `${(v1 / max) * 100}%`, background: getStatColor(v1) }} />
                      </div>
                    </div>

                    {/* Label */}
                    <div className="text-xs text-center font-semibold" style={{ color: "var(--text-muted)" }}>
                      {label}
                      {winner !== 0 && (
                        <div className="text-xs" style={{ color: winner === 1 ? "#4ade80" : "#f87171" }}>
                          {winner === 1 ? `+${v1-v2}` : `+${v2-v1}`}
                        </div>
                      )}
                    </div>

                    {/* P2 bar */}
                    <div className="flex items-center gap-2">
                      <div className="w-28 sm:w-40 h-2 rounded-full"
                        style={{ background: "var(--poke-surface-3)" }}>
                        <div className="h-2 rounded-full"
                          style={{ width: `${(v2 / max) * 100}%`, background: getStatColor(v2) }} />
                      </div>
                      <span className="text-sm font-bold"
                        style={{ color: winner === 2 ? "#4ade80" : "var(--text-primary)" }}>
                        {v2}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Winner summary */}
            <div className="px-6 pb-6">
              {(() => {
                const wins1 = STAT_LABELS.filter(({ key }) => {
                  const v1 = pokemon1.stats[key as keyof typeof pokemon1.stats] as number;
                  const v2 = pokemon2.stats[key as keyof typeof pokemon2.stats] as number;
                  return v1 > v2;
                }).length;
                const wins2 = STAT_LABELS.length - wins1;
                const overallWinner = pokemon1.stats.total > pokemon2.stats.total ? pokemon1 : pokemon2;
                const diff = Math.abs(pokemon1.stats.total - pokemon2.stats.total);
                return (
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                  >
                    <div className="text-sm font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                      🏆 Mayor Total Base Stats
                    </div>
                    <div className="text-xl font-black" style={{ color: "#4ade80", fontFamily: "Outfit,sans-serif" }}>
                      {overallWinner.nameEs}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      Ventaja de {diff} puntos · Gana {Math.max(wins1, wins2)} de {STAT_LABELS.length} categorías
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {(!pokemon1 || !pokemon2) && (
          <div
            className="p-16 rounded-2xl text-center"
            style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
          >
            <div className="text-6xl mb-4">⚔️</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Selecciona dos Pokémon
            </h2>
            <p style={{ color: "var(--text-muted)" }}>
              Busca y selecciona dos Pokémon para comparar sus estadísticas
            </p>
          </div>
        )}
      </main>
    </>
  );
}
