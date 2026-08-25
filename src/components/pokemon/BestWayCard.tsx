"use client";

import { getMethodLabel, getMethodIcon } from "@/lib/constants/method-icons";
import type { BestWay } from "@/lib/api/encounters";
import type { LocationEncounter } from "@/types/pokemon";
import { GAME_VERSIONS } from "@/lib/constants/game-versions";

interface Props {
  bestWay: BestWay | null;
  pokemonNameEs: string;
  encounters: LocationEncounter[];
  isEvolution?: boolean;
  evolutionFrom?: string;
  evolutionLevel?: number;
}

export default function BestWayCard({
  bestWay,
  pokemonNameEs,
  encounters,
  isEvolution,
  evolutionFrom,
  evolutionLevel,
}: Props) {
  // Stats summary
  const allVersions = new Set<string>();
  let totalVersionsWithEncounters = 0;
  let maxChance = 0;
  let minLevelOverall = 999;

  for (const enc of encounters) {
    for (const ver of enc.versions) {
      allVersions.add(ver.versionName);
      totalVersionsWithEncounters++;
      if (ver.maxChance > maxChance) maxChance = ver.maxChance;
      for (const det of ver.details) {
        if (det.minLevel < minLevelOverall) minLevelOverall = det.minLevel;
      }
    }
  }

  const gameData = bestWay
    ? GAME_VERSIONS.find((v) => v.id === bestWay.versionName)
    : null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
    >
      <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
        <h2 className="section-title flex items-center gap-2">
          🏆 Mejor Forma de Conseguirlo
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Evolution method */}
        {isEvolution && evolutionFrom && (
          <div
            className="p-5 rounded-xl"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
            id="best-way-evolution"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">✨</span>
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: "#c084fc" }}>
                  Método principal: Evolución
                </h3>
                <p style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--text-primary)" }}>{pokemonNameEs}</strong> se obtiene evolucionando a{" "}
                  <strong style={{ color: "#c084fc" }}>{evolutionFrom}</strong>
                  {evolutionLevel && ` al llegar al nivel ${evolutionLevel}`}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wild encounter recommendation */}
        {bestWay ? (
          <div
            className="p-5 rounded-xl"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
            id="best-way-wild"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">🌟</span>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2" style={{ color: "#4ade80" }}>
                  Recomendación
                </h3>
                <p className="mb-3" style={{ color: "var(--text-secondary)" }}>
                  La forma más sencilla de conseguir{" "}
                  <strong style={{ color: "var(--text-primary)" }}>{pokemonNameEs}</strong> en el mundo salvaje es en:
                </p>

                <div className="flex items-center gap-3 mb-4">
                  {gameData && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: gameData.color }}
                    />
                  )}
                  <span className="text-xl font-black" style={{ color: "var(--text-primary)", fontFamily: "Outfit,sans-serif" }}>
                    {bestWay.versionNameEs}
                  </span>
                </div>

                <div
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
                >
                  {[
                    { label: "Ubicación", value: bestWay.locationName, icon: "📍" },
                    {
                      label: "Método",
                      value: `${getMethodIcon(bestWay.method)} ${getMethodLabel(bestWay.method)}`,
                      icon: "",
                    },
                    { label: "Probabilidad", value: `${bestWay.maxChance}%`, icon: "🎯" },
                    { label: "Nivel mínimo", value: `Nv. ${bestWay.minLevel}`, icon: "📈" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-3 rounded-xl"
                      style={{ background: "var(--poke-surface-3)" }}
                    >
                      <div className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                        {item.label}
                      </div>
                      <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                        {item.icon} {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ background: "rgba(34,197,94,0.06)" }}
                >
                  <span>💡</span>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {bestWay.reason}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : !isEvolution ? (
          <div
            className="p-5 rounded-xl text-center"
            style={{ background: "var(--poke-surface-3)" }}
          >
            <div className="text-3xl mb-2">🎁</div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>
              No disponible en el mundo salvaje
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Se obtiene mediante evento especial, intercambio, regalo de NPC u otro método especial
            </p>
          </div>
        ) : null}

        {/* Summary stats */}
        {allVersions.size > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Versiones disponibles", value: allVersions.size, icon: "🎮" },
              { label: "Probabilidad máx.", value: `${maxChance}%`, icon: "🎯" },
              { label: "Nivel mínimo global", value: minLevelOverall < 999 ? `Nv. ${minLevelOverall}` : "—", icon: "📈" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl text-center"
                style={{ background: "var(--poke-surface-3)" }}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="text-xl font-black"
                  style={{ color: "var(--text-primary)", fontFamily: "Outfit,sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
