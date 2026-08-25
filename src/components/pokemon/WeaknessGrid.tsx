"use client";

import { useState } from "react";
import { TYPE_COLORS, TYPE_NAMES_ES } from "@/lib/constants/type-colors";
import type { TypeEffectiveness } from "@/types/pokemon";

interface Props {
  effectiveness: TypeEffectiveness;
  offensiveEffectiveness: TypeEffectiveness;
  pokemonTypes: string[];
}

function TypeChip({ type, multiplier, isOffense }: { type: string; multiplier: string, isOffense?: boolean }) {
  const tc = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
  
  // Para defensa: x0, x0.5, x0.25 es bueno (verde), x2, x4 es malo (rojo)
  // Para ataque: x2 es bueno (rojo/naranja), x0, x0.5 es malo (gris/azul oscuro)
  let color = "var(--text-secondary)";
  if (!isOffense) {
    if (multiplier === "×0" || multiplier === "×½" || multiplier === "×¼") color = "#22c55e"; // green
    if (multiplier === "×2" || multiplier === "×4") color = "#ef4444"; // red
  } else {
    if (multiplier === "×2") color = "#ef4444"; // red (super effective)
    if (multiplier === "×0" || multiplier === "×½") color = "#3b82f6"; // blue (not very effective)
  }

  return (
    <div
      className="flex flex-col items-center gap-1 p-2 rounded-xl transition-transform hover:scale-105"
      style={{ background: "var(--poke-surface-3)" }}
    >
      <div
        className="w-full text-center px-2 py-1 rounded-lg text-xs font-bold"
        style={{ background: tc.hex, color: "white" }}
      >
        {TYPE_NAMES_ES[type] ?? type}
      </div>
      <span
        className="text-sm font-black"
        style={{ color }}
      >
        {multiplier}
      </span>
    </div>
  );
}

const DEFENSE_CONFIG = [
  { key: "quadruple" as keyof TypeEffectiveness, label: "Muy débil contra", mult: "×4", color: "#dc2626", icon: "💀" },
  { key: "double" as keyof TypeEffectiveness,    label: "Débil contra",      mult: "×2", color: "#ef4444", icon: "⚠️" },
  { key: "half" as keyof TypeEffectiveness,      label: "Resistente a",      mult: "×½", color: "#16a34a", icon: "🛡️" },
  { key: "quarter" as keyof TypeEffectiveness,   label: "Muy resistente a",  mult: "×¼", color: "#15803d", icon: "💪" },
  { key: "immune" as keyof TypeEffectiveness,    label: "Inmune a",          mult: "×0", color: "#6366f1", icon: "🚫" },
];

const OFFENSE_CONFIG = [
  { key: "double" as keyof TypeEffectiveness,    label: "Súper eficaz contra", mult: "×2", color: "#ef4444", icon: "🔥" },
  { key: "half" as keyof TypeEffectiveness,      label: "Poco eficaz contra",  mult: "×½", color: "#3b82f6", icon: "💧" },
  { key: "immune" as keyof TypeEffectiveness,    label: "Sin efecto contra",   mult: "×0", color: "#64748b", icon: "🧱" },
];

export default function WeaknessGrid({ effectiveness, offensiveEffectiveness, pokemonTypes }: Props) {
  const [tab, setTab] = useState<"defense" | "offense">("defense");
  
  const currentEffectiveness = (tab === "defense" ? effectiveness : offensiveEffectiveness) || {
    immune: [], quarter: [], half: [], neutral: [], double: [], quadruple: []
  };
  const config = tab === "defense" ? DEFENSE_CONFIG : OFFENSE_CONFIG;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}
    >
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "var(--poke-border)" }}>
        <div>
          <h2 className="section-title flex items-center gap-2">
            ⚔️ Efectividades de Tipo
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {tab === "defense" 
              ? `Multiplicadores de daño recibido para ${pokemonTypes.map((t) => TYPE_NAMES_ES[t] ?? t).join("/")}`
              : `Multiplicadores de daño que hace ${pokemonTypes.map((t) => TYPE_NAMES_ES[t] ?? t).join("/")} a otros tipos`}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-poke-surface-3 p-1 rounded-xl" style={{ background: "var(--poke-surface-3)" }}>
          <button
            onClick={() => setTab("defense")}
            className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            style={{ 
              background: tab === "defense" ? "var(--poke-red)" : "transparent",
              color: tab === "defense" ? "white" : "var(--text-secondary)"
            }}
          >
            🛡️ Defensa
          </button>
          <button
            onClick={() => setTab("offense")}
            className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
            style={{ 
              background: tab === "offense" ? "var(--poke-red)" : "transparent",
              color: tab === "offense" ? "white" : "var(--text-secondary)"
            }}
          >
            ⚔️ Ataque
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {config.map(({ key, label, mult, color, icon }) => {
          const types = currentEffectiveness[key];
          if (!types || !types.length) return null;
          return (
            <div key={key} id={`effectiveness-${tab}-${key}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">{icon}</span>
                <h3
                  className="text-sm font-bold"
                  style={{ color }}
                >
                  {label}
                </h3>
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: `${color}22`, color }}
                >
                  {mult}
                </span>
              </div>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" }}
              >
                {types.map((type) => (
                  <TypeChip key={type} type={type} multiplier={mult} isOffense={tab === "offense"} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Neutral */}
        {currentEffectiveness.neutral && currentEffectiveness.neutral.length > 0 && (
          <div id={`effectiveness-${tab}-neutral`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">⚖️</span>
              <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                Daño normal
              </h3>
              <span
                className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ background: "var(--poke-surface-3)", color: "var(--text-secondary)" }}
              >
                ×1
              </span>
            </div>
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))" }}
            >
              {currentEffectiveness.neutral.map((type) => (
                <TypeChip key={type} type={type} multiplier="×1" isOffense={tab === "offense"} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
