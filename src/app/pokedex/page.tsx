"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TYPE_COLORS, TYPE_NAMES_ES } from "@/lib/constants/type-colors";
import { formatPokemonName, formatPokedexNumber } from "@/lib/utils/formatters";
import { GENERATION_RANGES } from "@/lib/constants/game-versions";

interface PokemonListItem {
  name: string;
  id: number;
}

const TYPES = Object.keys(TYPE_COLORS).filter(t => t !== "stellar" && t !== "unknown");

function PokedexContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGen, setFilterGen] = useState<number | null>(() => {
    const g = searchParams.get("gen");
    return g ? parseInt(g) : null;
  });
  const [filterType, setFilterType] = useState<string | null>(() => searchParams.get("type"));
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 48;

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((d) => {
        setAllPokemon(d.pokemon ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useCallback(() => {
    let list = allPokemon;
    if (filterGen) {
      const [min, max] = GENERATION_RANGES[filterGen] ?? [1, 151];
      list = list.filter((p) => p.id >= min && p.id <= max);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.includes(q) || String(p.id).includes(q));
    }
    return list;
  }, [allPokemon, filterGen, filterType, search]);

  const filteredList = filtered();
  const totalPages = Math.ceil(filteredList.length / PER_PAGE);
  const paginated = filteredList.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleGenFilter = (gen: number | null) => {
    setFilterGen(gen);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex flex-wrap gap-3">
        <input
          id="pokedex-search"
          type="search"
          placeholder="🔍 Buscar Pokémon..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl text-sm"
          style={{
            background: "var(--poke-surface)",
            border: "1px solid var(--poke-border)",
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        <span className="flex items-center text-sm px-3" style={{ color: "var(--text-muted)" }}>
          {filteredList.length} Pokémon
        </span>
      </div>

      {/* Gen filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleGenFilter(null)}
          id="gen-all"
          className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
          style={{
            background: filterGen === null ? "var(--poke-red)" : "var(--poke-surface)",
            color: filterGen === null ? "white" : "var(--text-secondary)",
            border: `1px solid ${filterGen === null ? "var(--poke-red)" : "var(--poke-border)"}`,
          }}
        >
          Todas
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((gen) => (
          <button
            key={gen}
            onClick={() => handleGenFilter(gen)}
            id={`pokedex-gen-${gen}`}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: filterGen === gen ? "var(--poke-red)" : "var(--poke-surface)",
              color: filterGen === gen ? "white" : "var(--text-secondary)",
              border: `1px solid ${filterGen === gen ? "var(--poke-red)" : "var(--poke-border)"}`,
            }}
          >
            Gen {gen}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="shimmer rounded-2xl h-32"
              style={{ background: "var(--poke-surface)" }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3" id="pokedex-grid">
          {paginated.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.name}`}
              id={`pokedex-card-${pokemon.id}`}
              className="pokemon-card glass rounded-2xl p-3 flex flex-col items-center gap-2 cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                alt={pokemon.name}
                width={64}
                height={64}
                className="w-16 h-16 object-contain"
                loading="lazy"
              />
              <span className="text-xs font-semibold text-center" style={{ color: "var(--text-primary)" }}>
                {formatPokemonName(pokemon.name)}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatPokedexNumber(pokemon.id)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap py-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            id="prev-page"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)", color: "var(--text-primary)" }}
          >
            ← Anterior
          </button>

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 7) pageNum = i + 1;
            else if (page <= 4) pageNum = i + 1;
            else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
            else pageNum = page - 3 + i;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                id={`page-${pageNum}`}
                className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: page === pageNum ? "var(--poke-red)" : "var(--poke-surface)",
                  color: page === pageNum ? "white" : "var(--text-primary)",
                  border: `1px solid ${page === pageNum ? "var(--poke-red)" : "var(--poke-border)"}`,
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            id="next-page"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)", color: "var(--text-primary)" }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}

export default function PokedexPage() {
  return (
    <>
      <nav
        className="sticky top-0 z-50 border-b px-4 py-4"
        style={{
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "var(--poke-border)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" style={{ color: "var(--poke-red)", fontWeight: 800, fontSize: "1.25rem", fontFamily: "Outfit,sans-serif", textDecoration: "none" }}>
            ← PokéDex Pro
          </Link>
          <h1
            className="text-xl font-black"
            style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
          >
            Pokédex Completa
          </h1>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div className="shimmer h-96 rounded-2xl" />}>
          <PokedexContent />
        </Suspense>
      </main>
    </>
  );
}
