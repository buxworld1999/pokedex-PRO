"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { GENERATION_NAMES } from "@/lib/constants/game-versions";
import { TYPE_NAMES_ES } from "@/lib/constants/type-colors";
import { formatPokemonName, formatPokedexNumber } from "@/lib/utils/formatters";

const FEATURED_POKEMON = [
  { name: "pikachu",    id: 25 },
  { name: "charizard",  id: 6 },
  { name: "mewtwo",     id: 150 },
  { name: "eevee",      id: 133 },
  { name: "gengar",     id: 94 },
  { name: "dragonite",  id: 149 },
  { name: "snorlax",    id: 143 },
  { name: "lucario",    id: 448 },
  { name: "garchomp",   id: 445 },
  { name: "greninja",   id: 658 },
  { name: "rayquaza",   id: 384 },
  { name: "umbreon",    id: 197 },
];

const SEARCH_HISTORY_KEY = "pokedex-search-history";

function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]");
      setHistory(stored);
    } catch {}
  }, []);

  const addToHistory = useCallback((name: string) => {
    setHistory((prev) => {
      const next = [name, ...prev.filter((n) => n !== name)].slice(0, 8);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allPokemon, setAllPokemon] = useState<{ name: string; id: number }[]>([]);
  const [suggestions, setSuggestions] = useState<{ name: string; id: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedGen, setSelectedGen] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => { if (d.pokemon) setAllPokemon(d.pokemon); })
      .catch(() => {});
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const lower = q.toLowerCase();
      const filtered = allPokemon
        .filter((p) => p.name.includes(lower) || String(p.id).includes(lower))
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIdx(-1);
    },
    [allPokemon]
  );

  const navigate = (name: string) => {
    addToHistory(name);
    router.push(`/pokemon/${name}`);
    setQuery("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const match = allPokemon.find((p) => p.name === q || String(p.id) === q);
    if (match) navigate(match.name);
    else if (suggestions.length > 0) navigate(suggestions[0].name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter" && selectedIdx >= 0) { e.preventDefault(); navigate(suggestions[selectedIdx].name); }
    else if (e.key === "Escape") setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Background elements */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #cc0000 0%, transparent 50%), radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 50%)`,
          }}
        />

        {/* Pokéball decorativo */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-5"
          style={{ border: "40px solid white" }}
        />
        <div
          className="absolute -right-20 top-20 w-80 h-2 opacity-10"
          style={{ background: "white" }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(204,0,0,0.15)",
              border: "1px solid rgba(204,0,0,0.3)",
              color: "#ff6666",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-glow inline-block" />
            Todas las generaciones · +1000 Pokémon
          </div>

          {/* Title */}
          <h1
            className="text-5xl sm:text-7xl font-black mb-4 tracking-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            <span style={{ color: "var(--text-primary)" }}>Poké</span>
            <span style={{ color: "var(--poke-red)" }}>Dex</span>
            <span
              className="block text-2xl sm:text-3xl font-medium mt-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Pokédex Completa · Todas las Generaciones
            </span>
          </h1>

          <p
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Busca cualquier Pokémon y obtén información completa: estadísticas,
            tipos, ubicaciones por juego, evoluciones, información competitiva y
            más.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}>
              <div
                className="flex items-center gap-3 p-3 rounded-2xl shadow-2xl"
                style={{
                  background: "var(--poke-surface)",
                  border: "2px solid var(--poke-border)",
                }}
              >
                <span className="text-2xl pl-2" aria-hidden="true">🔍</span>
                <input
                  ref={inputRef}
                  id="hero-search"
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); handleSearch(e.target.value); }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query && setShowSuggestions(true)}
                  placeholder="Escribe el nombre o número del Pokémon..."
                  autoComplete="off"
                  className="flex-1 bg-transparent text-lg font-medium outline-none"
                  style={{ color: "var(--text-primary)" }}
                  aria-label="Buscar Pokémon"
                />
                <button
                  type="submit"
                  id="hero-search-btn"
                  className="px-6 py-2.5 rounded-xl font-bold text-white transition-all"
                  style={{ background: "var(--poke-red)" }}
                >
                  Buscar
                </button>
              </div>
            </form>

            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-40 shadow-2xl"
                style={{
                  background: "var(--poke-surface-2)",
                  border: "1px solid var(--poke-border)",
                }}
              >
                {suggestions.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => navigate(p.name)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm"
                    style={{
                      background: i === selectedIdx ? "var(--poke-surface-3)" : "transparent",
                      color: "var(--text-primary)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="flex-1 font-semibold">{formatPokemonName(p.name)}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {formatPokedexNumber(p.id)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search History */}
          {history.length > 0 && !showSuggestions && (
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Recientes:</span>
              {history.map((name) => (
                <button
                  key={name}
                  onClick={() => navigate(name)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: "var(--poke-surface-2)",
                    border: "1px solid var(--poke-border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {formatPokemonName(name)}
                </button>
              ))}
              <button
                onClick={clearHistory}
                className="text-xs underline"
                style={{ color: "var(--text-muted)" }}
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats banner */}
      <section
        className="py-8 border-y"
        style={{ borderColor: "var(--poke-border)", background: "var(--poke-surface)" }}
      >
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { emoji: "⚡", value: "1,025+", label: "Pokémon" },
            { emoji: "🎮", value: "37", label: "Juegos" },
            { emoji: "🗺️", value: "10", label: "Regiones" },
            { emoji: "📊", value: "18", label: "Tipos" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div
                className="text-2xl font-black"
                style={{ color: "var(--text-primary)", fontFamily: "Outfit,sans-serif" }}
              >
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Pokémon */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-black"
            style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
          >
            Pokémon Destacados
          </h2>
          <Link
            href="/pokedex"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--poke-red)" }}
            id="view-all-link"
          >
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_POKEMON.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              id={`featured-${pokemon.name}`}
              className="pokemon-card glass rounded-2xl p-4 flex flex-col items-center gap-2 group cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                alt={pokemon.name}
                width={96}
                height={96}
                className="w-24 h-24 object-contain float-animation"
                loading="lazy"
              />
              <span
                className="text-xs font-semibold text-center"
                style={{ color: "var(--text-primary)" }}
              >
                {formatPokemonName(pokemon.name)}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatPokedexNumber(pokemon.id)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2
          className="text-2xl font-black mb-6"
          style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
        >
          Explorar por Generación
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
            <Link
              key={gen}
              href={`/pokedex?gen=${gen}`}
              id={`gen-filter-${gen}`}
              className="glass rounded-xl p-3 text-center transition-all hover:scale-105 cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <div
                className="text-lg font-black"
                style={{ color: "var(--poke-red)", fontFamily: "Outfit,sans-serif" }}
              >
                Gen {gen}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {
                  ["Kanto","Johto","Hoenn","Sinnoh","Unova","Kalos","Alola","Galar","Paldea"][
                    gen - 1
                  ]
                }
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tipos */}
      <section className="py-12 px-4 max-w-7xl mx-auto pb-20">
        <h2
          className="text-2xl font-black mb-6"
          style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
        >
          Explorar por Tipo
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(TYPE_NAMES_ES).map(([key, nameEs]) => (
            <Link
              key={key}
              href={`/pokedex?type=${key}`}
              id={`type-filter-${key}`}
              className="type-badge transition-all hover:scale-105 cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              {nameEs}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
