"use client";

import { useState } from "react";
import { TYPE_COLORS, TYPE_NAMES_ES } from "@/lib/constants/type-colors";
import { formatPokemonName, formatPokedexNumber, formatHeight, formatWeight, formatAbilityName } from "@/lib/utils/formatters";

interface Props {
  id: number;
  name: string;
  nameEs: string;
  types: string[];
  sprites: {
    official: string | null;
    officialShiny: string | null;
    home: string | null;
    homeShiny: string | null;
    default: string | null;
    shiny: string | null;
    showdown: string | null;
  };
  height: number;
  weight: number;
  genus: string;
  description: string;
  generation: number;
  rarity: string;
  abilities: { name: string; isHidden: boolean; slot: number }[];
  isLegendary: boolean;
  isMythical: boolean;
  gender: string;
  color: string;
}

export default function PokemonHero({
  id, name, nameEs, types, sprites, height, weight,
  genus, description, generation, rarity, abilities,
  isLegendary, isMythical, gender, color,
}: Props) {
  const [isShiny, setIsShiny] = useState(false);
  const [imgType, setImgType] = useState<"artwork" | "home" | "sprite">("artwork");

  const primaryType = types[0] ?? "normal";
  const typeColor = TYPE_COLORS[primaryType] ?? TYPE_COLORS.normal;

  const currentSprite = (() => {
    if (imgType === "artwork") return isShiny ? sprites.officialShiny ?? sprites.official : sprites.official;
    if (imgType === "home") return isShiny ? sprites.homeShiny ?? sprites.home : sprites.home;
    return isShiny ? sprites.shiny : sprites.default;
  })();

  return (
    <div className="relative overflow-hidden rounded-3xl"
      style={{ background: `linear-gradient(135deg, var(--poke-surface) 0%, var(--poke-surface-2) 100%)`, border: "1px solid var(--poke-border)" }}>

      {/* Background type glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle at 70% 50%, ${typeColor.hex}, transparent 60%)` }} />

      <div className="relative p-6 sm:p-8 grid md:grid-cols-2 gap-8 items-center">
        {/* Image side */}
        <div className="flex flex-col items-center gap-4">
          {/* Image type tabs */}
          <div className="flex gap-2">
            {(["artwork", "home", "sprite"] as const).map((t) => (
              <button key={t}
                onClick={() => setImgType(t)}
                id={`img-tab-${t}`}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: imgType === t ? typeColor.hex : "var(--poke-surface-3)",
                  color: imgType === t ? "white" : "var(--text-secondary)",
                }}>
                {t === "artwork" ? "Arte Oficial" : t === "home" ? "Pokémon HOME" : "Sprite"}
              </button>
            ))}
          </div>

          {/* Pokémon image */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full opacity-20 blur-2xl"
              style={{ background: typeColor.hex }} />
            {currentSprite ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentSprite}
                alt={`${nameEs}${isShiny ? " shiny" : ""}`}
                className="relative w-56 h-56 object-contain float-animation drop-shadow-2xl"
                id="pokemon-main-image"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-8xl">❓</div>
            )}
          </div>

          {/* Shiny toggle */}
          <button
            onClick={() => setIsShiny((s) => !s)}
            id="shiny-toggle"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all"
            style={{
              background: isShiny ? "rgba(251,191,36,0.15)" : "var(--poke-surface-3)",
              border: `1px solid ${isShiny ? "rgba(251,191,36,0.4)" : "var(--poke-border)"}`,
              color: isShiny ? "#fbbf24" : "var(--text-secondary)",
            }}
          >
            ✨ {isShiny ? "Versión Shiny" : "Ver versión Shiny"}
          </button>
        </div>

        {/* Info side */}
        <div className="space-y-4">
          {/* Number and generation */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              {formatPokedexNumber(id)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "var(--poke-surface-3)", color: "var(--text-secondary)" }}>
              Generación {generation}
            </span>
            {isLegendary && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }}>
                ⭐ Legendario
              </span>
            )}
            {isMythical && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(236,72,153,0.15)", color: "#ec4899", border: "1px solid rgba(236,72,153,0.3)" }}>
                💫 Singular
              </span>
            )}
          </div>

          {/* Name */}
          <div>
            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
            >
              {nameEs}
            </h1>
            {nameEs !== formatPokemonName(name) && (
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {formatPokemonName(name)}
              </p>
            )}
            {genus && (
              <p className="text-base mt-1" style={{ color: "var(--text-secondary)" }}>
                {genus}
              </p>
            )}
          </div>

          {/* Types */}
          <div className="flex gap-2 flex-wrap" id="pokemon-types">
            {types.map((type) => {
              const tc = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
              return (
                <span
                  key={type}
                  className="type-badge"
                  style={{ background: tc.hex, color: "white" }}
                >
                  {TYPE_NAMES_ES[type] ?? type}
                </span>
              );
            })}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              &ldquo;{description}&rdquo;
            </p>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Altura", value: formatHeight(height), icon: "📏" },
              { label: "Peso", value: formatWeight(weight), icon: "⚖️" },
              { label: "Rareza", value: rarity, icon: "✨" },
              { label: "Género", value: gender, icon: "⚧" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-3"
                style={{ background: "var(--poke-surface-3)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    {item.label}
                  </span>
                </div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: "var(--text-muted)" }}>
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-2" id="pokemon-abilities">
              {abilities.map((a) => (
                <span key={a.name}
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{
                    background: a.isHidden ? "rgba(168,85,247,0.15)" : "var(--poke-surface-3)",
                    border: `1px solid ${a.isHidden ? "rgba(168,85,247,0.3)" : "var(--poke-border)"}`,
                    color: a.isHidden ? "#a855f7" : "var(--text-primary)",
                  }}>
                  {formatAbilityName(a.name)}
                  {a.isHidden && <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>(Oculta)</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
