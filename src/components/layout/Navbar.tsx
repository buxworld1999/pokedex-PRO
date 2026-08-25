"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { formatPokemonName, formatPokedexNumber } from "@/lib/utils/formatters";

interface SearchResult {
  name: string;
  id: number;
}

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allPokemon, setAllPokemon] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cargar lista completa al montar
  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data) => {
        if (data.pokemon) setAllPokemon(data.pokemon);
      })
      .catch(() => {});
  }, []);

  // Búsqueda filtrada
  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      const lower = q.toLowerCase();
      const filtered = allPokemon
        .filter(
          (p) =>
            p.name.includes(lower) ||
            String(p.id).includes(lower)
        )
        .slice(0, 8);
      setResults(filtered);
      setShowDropdown(true);
      setSelectedIdx(-1);
    },
    [allPokemon]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    search(val);
  };

  const handleSelect = (name: string) => {
    setQuery("");
    setShowDropdown(false);
    router.push(`/pokemon/${name}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const match = allPokemon.find(
      (p) => p.name === query.toLowerCase() || String(p.id) === query
    );
    if (match) {
      handleSelect(match.name);
    } else if (results.length > 0) {
      handleSelect(results[0].name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIdx].name);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(10,10,15,0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--poke-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            id="navbar-logo"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm"
              style={{ background: "var(--poke-red)" }}
            >
              P
            </div>
            <span
              className="font-black text-xl tracking-tight hidden sm:block"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              <span style={{ color: "var(--poke-red)" }}>Poké</span>
              <span style={{ color: "var(--text-primary)" }}>Dex Pro</span>
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-lg pointer-events-none"
                  aria-hidden="true"
                >
                  🔍
                </span>
                <input
                  ref={inputRef}
                  id="navbar-search"
                  type="search"
                  value={query}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query && setShowDropdown(true)}
                  placeholder="Buscar Pokémon por nombre o número..."
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all"
                  style={{
                    background: "var(--poke-surface-2)",
                    border: "1px solid var(--poke-border)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor =
                      "var(--poke-border-hover)")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor =
                      "var(--poke-border)")
                  }
                  aria-label="Buscar Pokémon"
                  aria-expanded={showDropdown}
                  aria-autocomplete="list"
                  role="combobox"
                />
              </div>
            </form>

            {/* Dropdown */}
            {showDropdown && results.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{
                  background: "var(--poke-surface-2)",
                  border: "1px solid var(--poke-border)",
                }}
                role="listbox"
              >
                {results.map((pokemon, i) => (
                  <button
                    key={pokemon.name}
                    role="option"
                    aria-selected={i === selectedIdx}
                    onClick={() => handleSelect(pokemon.name)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm"
                    style={{
                      background:
                        i === selectedIdx
                          ? "var(--poke-surface-3)"
                          : "transparent",
                      color: "var(--text-primary)",
                    }}
                    id={`search-result-${i}`}
                  >
                    {/* Mini sprite */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                      alt={pokemon.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 object-contain"
                      loading="lazy"
                    />
                    <span className="flex-1 font-medium">
                      {formatPokemonName(pokemon.name)}
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
                      {formatPokedexNumber(pokemon.id)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href="/pokedex"
              id="nav-pokedex"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden md:block"
              style={{ color: "var(--text-secondary)" }}
            >
              Pokédex
            </Link>
            <Link
              href="/compare"
              id="nav-compare"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors hidden md:block"
              style={{ color: "var(--text-secondary)" }}
            >
              Comparar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
