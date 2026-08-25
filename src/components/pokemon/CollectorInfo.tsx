"use client";

import { getRarityColor } from "@/lib/utils/formatters";
import type { LocationEncounter } from "@/types/pokemon";

interface Props {
  rarity: string;
  captureRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  isBaby: boolean;
  eggGroups: string[];
  hatchCounter: number;
  baseHappiness: number;
  growthRate: string;
  color: string;
  encounters: LocationEncounter[];
}

const GROWTH_RATE_NAMES: Record<string, string> = {
  "slow": "Lento",
  "medium": "Medio",
  "fast": "Rápido",
  "medium-slow": "Medio-lento",
  "slow-then-very-fast": "Lento → Muy rápido",
  "fast-then-very-slow": "Rápido → Muy lento",
};

const AVAILABILITY_ICONS: Record<string, string> = {
  "Salvaje": "🌿",
  "Evolución": "✨",
  "Evento": "🌟",
  "Intercambio": "🔄",
  "Legendario": "⭐",
  "Singular": "💫",
};

export default function CollectorInfo({
  rarity, captureRate, isLegendary, isMythical, isBaby,
  eggGroups, hatchCounter, baseHappiness, growthRate,
  color, encounters,
}: Props) {
  const availabilityTypes: string[] = [];
  if (encounters.length > 0) availabilityTypes.push("Salvaje");
  if (isLegendary) availabilityTypes.push("Legendario");
  if (isMythical) { availabilityTypes.push("Singular"); availabilityTypes.push("Evento"); }

  const capturePercent = Math.round((captureRate / 255) * 100);
  const rarityColor = getRarityColor(rarity);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
        <h2 className="section-title flex items-center gap-2">
          🏅 Información para Coleccionistas
        </h2>
      </div>

      <div className="p-6 grid sm:grid-cols-2 gap-6">
        {/* Rarity */}
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--poke-surface-3)" }}
          id="collector-rarity"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}>
            Rareza
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">
              {isMythical ? "💫" : isLegendary ? "⭐" : rarity === "Muy raro" ? "💎" : rarity === "Raro" ? "🔵" : rarity === "Poco común" ? "🟢" : "⚪"}
            </span>
            <div>
              <div className={`text-xl font-black ${rarityColor}`} style={{ fontFamily: "Outfit,sans-serif" }}>
                {rarity}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Tasa de captura: {captureRate}/255
              </div>
            </div>
          </div>

          {/* Capture rate bar */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              <span>Dificultad de captura</span>
              <span>{capturePercent}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "var(--poke-surface)" }}>
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{
                  width: `${capturePercent}%`,
                  background: capturePercent > 60 ? "#22c55e" : capturePercent > 30 ? "#eab308" : "#ef4444",
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              <span>Más difícil</span>
              <span>Más fácil</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--poke-surface-3)" }}
          id="collector-availability"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}>
            Disponibilidad
          </h3>
          {availabilityTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availabilityTypes.map((type) => (
                <span
                  key={type}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ background: "var(--poke-surface-2)", color: "var(--text-secondary)", border: "1px solid var(--poke-border)" }}
                >
                  {AVAILABILITY_ICONS[type] ?? "📦"} {type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Disponible mediante métodos especiales
            </p>
          )}

          {isBaby && (
            <div
              className="mt-3 p-3 rounded-lg flex items-center gap-2"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <span>🍼</span>
              <span className="text-xs font-medium" style={{ color: "#fbbf24" }}>
                Pokémon bebé — Se puede obtener mediante cría
              </span>
            </div>
          )}
        </div>

        {/* Breeding info */}
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--poke-surface-3)" }}
          id="collector-breeding"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}>
            Información de Cría
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Grupo huevo</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {eggGroups.join(", ") || "Sin huevos"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Ciclos de huevo</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {hatchCounter} ({(hatchCounter + 1) * 257} pasos)
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Tasa de crecimiento</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {GROWTH_RATE_NAMES[growthRate] ?? growthRate}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--text-secondary)" }}>Felicidad base</span>
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {baseHappiness}/255
              </span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div
          className="p-5 rounded-xl"
          style={{ background: "var(--poke-surface-3)" }}
          id="collector-tips"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4"
            style={{ color: "var(--text-muted)" }}>
            Consejos de Captura
          </h3>
          <div className="space-y-2">
            {captureRate < 30 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0">⚠️</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  Pokémon difícil de capturar. Usa Pokéball Ultra o Máster Ball.
                </span>
              </div>
            )}
            {captureRate >= 30 && captureRate < 100 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0">💡</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  Reducir sus PS al mínimo y aplicar estados negativos aumenta las probabilidades.
                </span>
              </div>
            )}
            {captureRate >= 100 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0">✅</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  Relativamente fácil de capturar. Una Pokéball normal puede funcionar.
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 text-sm">
              <span className="flex-shrink-0">🌙</span>
              <span style={{ color: "var(--text-secondary)" }}>
                Algunas Pokéball como la Pokéball Noche son más efectivas en ciertos horarios.
              </span>
            </div>
            {isLegendary && (
              <div className="flex items-start gap-2 text-sm">
                <span className="flex-shrink-0">⭐</span>
                <span style={{ color: "var(--text-secondary)" }}>
                  Guarda la partida antes de enfrentarlo. Si escapa o desmaya, recarga y vuelve a intentarlo.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
