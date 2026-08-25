"use client";

import { useEffect, useRef, useState } from "react";
import { getStatColor, STAT_NAMES } from "@/lib/utils/formatters";

interface Props {
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
    total: number;
  };
  typeColor: string;
}

const STAT_MAP = [
  { key: "hp",             label: "PS",           abbr: "PS",   max: 255 },
  { key: "attack",         label: "Ataque",       abbr: "ATK",  max: 190 },
  { key: "defense",        label: "Defensa",      abbr: "DEF",  max: 250 },
  { key: "specialAttack",  label: "At. Especial", abbr: "SpA",  max: 194 },
  { key: "specialDefense", label: "Def. Especial",abbr: "SpD",  max: 250 },
  { key: "speed",          label: "Velocidad",    abbr: "SPE",  max: 200 },
];

function StatBar({ label, abbr, value, max, color, animDelay }: {
  label: string; abbr: string; value: number; max: number; color: string; animDelay: number;
}) {
  const [width, setWidth] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), animDelay);
    return () => clearTimeout(t);
  }, [value, max, animDelay]);

  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-right">
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{abbr}</span>
      </div>
      <div className="w-10 text-right">
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</span>
      </div>
      <div className="flex-1 h-2.5 rounded-full" style={{ background: "var(--poke-surface-3)" }}>
        <div
          className="h-2.5 rounded-full transition-all duration-700"
          style={{
            width: `${width}%`,
            background: color,
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
      <div className="w-10 text-left">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{max}</span>
      </div>
    </div>
  );
}

// SVG Radar Chart
function RadarChart({ stats, typeColor }: { stats: Props["stats"]; typeColor: string }) {
  const values = [
    stats.hp / 255,
    stats.attack / 190,
    stats.defense / 250,
    stats.specialAttack / 194,
    stats.specialDefense / 250,
    stats.speed / 200,
  ];
  const labels = ["PS", "ATK", "DEF", "SpA", "SpD", "SPE"];
  const cx = 120, cy = 120, r = 90;
  const n = values.length;

  const getPoint = (i: number, radius: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = values.map((v, i) => getPoint(i, v * r));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, r * level));
        const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
        return (
          <path key={level} d={d} fill="none"
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        );
      })}
      {/* Axes */}
      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
      })}
      {/* Data */}
      <path d={pathD} fill={`${typeColor}33`} stroke={typeColor} strokeWidth="2" />
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(i, r + 16);
        return (
          <text key={label} x={p.x} y={p.y}
            textAnchor="middle" dominantBaseline="central"
            fontSize="10" fontWeight="600"
            fill="rgba(255,255,255,0.6)">
            {label}
          </text>
        );
      })}
      {/* Values on data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={typeColor} />
      ))}
    </svg>
  );
}

export default function StatsSection({ stats, typeColor }: Props) {
  const totalMax = 1125; // Max total (Arceus-like builds)

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "var(--poke-surface)", border: "1px solid var(--poke-border)" }}>
      <div className="p-6 border-b" style={{ borderColor: "var(--poke-border)" }}>
        <h2 className="section-title flex items-center gap-2">
          📊 Estadísticas Base
        </h2>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* Bars */}
        <div className="space-y-3" id="stats-bars">
          {STAT_MAP.map((stat, i) => (
            <StatBar
              key={stat.key}
              label={stat.label}
              abbr={stat.abbr}
              value={stats[stat.key as keyof typeof stats] as number}
              max={stat.max}
              color={getStatColor(stats[stat.key as keyof typeof stats] as number)}
              animDelay={i * 100}
            />
          ))}
          {/* Total */}
          <div className="flex items-center gap-3 mt-4 pt-4"
            style={{ borderTop: "1px solid var(--poke-border)" }}>
            <div className="w-20 text-right">
              <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>TOTAL</span>
            </div>
            <div className="w-10 text-right">
              <span className="text-base font-black" style={{ color: "var(--text-primary)" }}>
                {stats.total}
              </span>
            </div>
            <div className="flex-1 h-3 rounded-full" style={{ background: "var(--poke-surface-3)" }}>
              <div
                className="h-3 rounded-full transition-all duration-1000"
                style={{
                  width: `${(stats.total / totalMax) * 100}%`,
                  background: `linear-gradient(90deg, ${typeColor}, ${typeColor}aa)`,
                }}
              />
            </div>
            <div className="w-10 text-left">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{totalMax}</span>
            </div>
          </div>
        </div>

        {/* Radar */}
        <div id="stats-radar">
          <RadarChart stats={stats} typeColor={typeColor} />
          <div className="text-center mt-2">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Gráfico de estadísticas base
            </span>
          </div>
        </div>
      </div>

      {/* Stat summary */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STAT_MAP.map((stat) => {
            const val = stats[stat.key as keyof typeof stats] as number;
            const color = getStatColor(val);
            return (
              <div key={stat.key}
                className="rounded-xl p-3 text-center"
                style={{ background: "var(--poke-surface-3)" }}>
                <div className="text-xs font-semibold mb-1"
                  style={{ color: "var(--text-muted)" }}>{stat.abbr}</div>
                <div className="text-xl font-black"
                  style={{ color, fontFamily: "Outfit,sans-serif" }}>{val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
