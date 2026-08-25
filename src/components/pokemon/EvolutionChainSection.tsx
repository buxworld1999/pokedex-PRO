"use client";

import Link from "next/link";
import { formatPokemonName, formatPokedexNumber } from "@/lib/utils/formatters";
import type { EvolutionChain, EvolutionChainLink, EvolutionDetail } from "@/types/pokemon";

interface EvolutionStep {
  name: string;
  id: number;
  details: EvolutionDetail | null;
}

function getIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

function flattenChain(chain: EvolutionChainLink): EvolutionStep[][] {
  const result: EvolutionStep[][] = [];
  
  function walk(link: EvolutionChainLink, depth: number) {
    if (!result[depth]) result[depth] = [];
    result[depth].push({
      name: link.species.name,
      id: getIdFromUrl(link.species.url),
      details: link.evolution_details[0] ?? null,
    });
    for (const next of link.evolves_to) {
      walk(next, depth + 1);
    }
  }
  
  walk(chain, 0);
  return result;
}

function formatTrigger(details: EvolutionDetail | null): string {
  if (!details) return "Base";
  const { trigger, min_level, item, held_item, min_happiness, time_of_day, trade_species, known_move } = details;
  
  if (trigger.name === "level-up") {
    if (min_level) return `Nivel ${min_level}`;
    if (min_happiness) return `Felicidad alta`;
    if (time_of_day) return `Nivel (${time_of_day === "day" ? "día" : "noche"})`;
    if (known_move) return `Aprender ${formatPokemonName(known_move.name)}`;
    return "Nivel up";
  }
  if (trigger.name === "trade") {
    if (held_item) return `Intercambio con ${formatPokemonName(held_item.name)}`;
    if (trade_species) return `Intercambio con ${formatPokemonName(trade_species.name)}`;
    return "Intercambio";
  }
  if (trigger.name === "use-item" && item) {
    return formatPokemonName(item.name);
  }
  return formatPokemonName(trigger.name);
}

interface Props {
  evolutionChain: EvolutionChain;
  currentPokemonName: string;
}

export default function EvolutionChainSection({ evolutionChain, currentPokemonName }: Props) {
  const steps = flattenChain(evolutionChain.chain);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
        <h2 className="section-title flex items-center gap-2">
          ✨ Cadena de Evolución
        </h2>
      </div>

      <div className="p-6" id="evolution-chain">
        {steps.length <= 1 ? (
          <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
            <div className="text-4xl mb-3">🌟</div>
            <p className="font-medium">Este Pokémon no evoluciona</p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {steps.map((stage, stageIdx) => (
              <div key={stageIdx} className="flex items-center gap-2 flex-wrap justify-center">
                {/* Arrow between stages */}
                {stageIdx > 0 && (
                  <div className="flex flex-col items-center gap-1 text-center mx-2">
                    <div className="text-xl" style={{ color: "var(--text-muted)" }}>→</div>
                    <div
                      className="text-xs px-2 py-1 rounded-lg max-w-24 text-center"
                      style={{
                        background: "var(--poke-surface-3)",
                        color: "var(--text-secondary)",
                        fontSize: "0.65rem",
                      }}
                    >
                      {formatTrigger(stage[0]?.details ?? null)}
                    </div>
                  </div>
                )}

                {/* Stage pokémon(s) */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {stage.map((pokemon) => {
                    const isCurrent = pokemon.name === currentPokemonName;
                    return (
                      <Link
                        key={pokemon.name}
                        href={`/pokemon/${pokemon.name}`}
                        id={`evo-${pokemon.name}`}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 cursor-pointer"
                        style={{
                          background: isCurrent
                            ? "rgba(204,0,0,0.12)"
                            : "var(--poke-surface-3)",
                          border: `1px solid ${isCurrent ? "rgba(204,0,0,0.4)" : "var(--poke-border)"}`,
                          textDecoration: "none",
                          minWidth: "88px",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                          alt={pokemon.name}
                          width={72}
                          height={72}
                          className="w-18 h-18 object-contain"
                          style={{ width: 72, height: 72 }}
                          loading="lazy"
                        />
                        <div className="text-center">
                          <div
                            className="text-xs font-bold"
                            style={{ color: isCurrent ? "#ff6666" : "var(--text-primary)" }}
                          >
                            {formatPokemonName(pokemon.name)}
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {formatPokedexNumber(pokemon.id)}
                          </div>
                        </div>
                        {isCurrent && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              background: "rgba(204,0,0,0.2)",
                              color: "#ff6666",
                              fontSize: "0.6rem",
                            }}
                          >
                            Actual
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
