// Iconos y etiquetas para métodos de obtención de Pokémon
export type ObtainMethod =
  | "walk"
  | "old-rod"
  | "good-rod"
  | "super-rod"
  | "surf"
  | "rock-smash"
  | "waterfall"
  | "gift"
  | "gift-egg"
  | "pick-up"
  | "headbutt"
  | "poke-radar"
  | "sos-battle"
  | "strong-style"
  | "agile-style"
  | "raid"
  | "dynamax-adventure"
  | "tera-raid"
  | "egg"
  | "trade"
  | "evolution"
  | "event"
  | "safari"
  | "super-contests"
  | string;

export const METHOD_LABELS_ES: Record<string, string> = {
  "walk":                "Hierba alta / Cueva",
  "old-rod":             "Caña vieja",
  "good-rod":            "Supercaña",
  "super-rod":           "Hipercaña",
  "surf":                "Surf",
  "rock-smash":          "Romperocas",
  "waterfall":           "Cascada",
  "gift":                "Regalo de NPC",
  "gift-egg":            "Huevo regalo",
  "pick-up":             "Recolecta",
  "headbutt":            "Cabezazo (árbol)",
  "poke-radar":          "Poké Radar",
  "sos-battle":          "Batalla SOS",
  "strong-style":        "Estilo poderoso",
  "agile-style":         "Estilo ágil",
  "raid":                "Incursión",
  "dynamax-adventure":   "Aventura Dinamax",
  "tera-raid":           "Teraincursión",
  "egg":                 "Huevo Pokémon",
  "trade":               "Intercambio",
  "evolution":           "Evolución",
  "event":               "Evento especial",
  "safari":              "Zona Safari",
  "super-contests":      "Superconcurso",
  "only-one":            "Único ejemplar",
  "island-scan":         "Escáner Insular",
  "max-raid":            "Incursión Dinamax",
  "overworld-flying-special": "Volando en el mapa (Especial)",
};

export const METHOD_ICONS: Record<string, string> = {
  "walk":               "🌿",
  "old-rod":            "🎣",
  "good-rod":           "🎣",
  "super-rod":          "🎣",
  "surf":               "🌊",
  "rock-smash":         "🪨",
  "waterfall":          "💧",
  "gift":               "🎁",
  "gift-egg":           "🥚",
  "pick-up":            "📦",
  "headbutt":           "🌳",
  "poke-radar":         "📡",
  "sos-battle":         "🆘",
  "strong-style":       "💪",
  "agile-style":        "⚡",
  "raid":               "⚔️",
  "dynamax-adventure":  "🔴",
  "tera-raid":          "💎",
  "egg":                "🥚",
  "trade":              "🔄",
  "evolution":          "✨",
  "event":              "🌟",
  "safari":             "🦁",
  "super-contests":     "🎭",
  "only-one":           "🏆",
  "island-scan":        "🔎",
  "max-raid":           "🌋",
  "overworld-flying-special": "🦅",
};

export function getMethodLabel(method: string): string {
  return METHOD_LABELS_ES[method] ?? method.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getMethodIcon(method: string): string {
  return METHOD_ICONS[method] ?? "❓";
}

export function translateCondition(condition: string): string {
  if (condition.startsWith("great-marsh-daily-slot-")) {
    const slot = condition.replace("great-marsh-daily-slot-", "").replace("-of-32", "");
    return `Gran Pantano (Rotación diaria: Zona ${slot})`;
  }
  if (condition === "swarm-yes") return "En manada (Swarm)";
  if (condition === "swarm-no") return "Sin manada";
  if (condition === "time-morning") return "Por la mañana";
  if (condition === "time-day") return "De día";
  if (condition === "time-night") return "De noche";
  if (condition === "radar-on") return "Usando Poké Radar";
  if (condition === "radar-off") return "Sin Poké Radar";
  if (condition === "radio-hoenn") return "Sonido Hoenn (Radio)";
  if (condition === "radio-sinnoh") return "Sonido Sinnoh (Radio)";
  if (condition === "season-spring") return "Primavera";
  if (condition === "season-summer") return "Verano";
  if (condition === "season-autumn") return "Otoño";
  if (condition === "season-winter") return "Invierno";
  
  if (condition.startsWith("slot2-")) {
    return `Cartucho insertado: ${condition.replace("slot2-", "")}`;
  }

  if (condition.startsWith("max-den-rarity-")) {
    const rarity = condition.replace("max-den-rarity-", "");
    return `Rareza de nido: ${rarity === "rare" ? "Raro" : rarity === "common" ? "Común" : rarity}`;
  }

  if (condition.startsWith("max-den-rating-")) {
    const rating = condition.replace("max-den-rating-", "").replace("-star", "");
    return `Estrellas de nido: ⭐${rating}`;
  }

  if (condition.startsWith("bug-catching-contest-")) {
    const isYes = condition.includes("yes");
    return `Concurso de Captura de Bichos: ${isYes ? "Sí" : "No"}`;
  }

  if (condition.startsWith("story-progress-")) {
    if (condition === "story-progress-before-national-dex") return "Antes de la Pokédex Nacional";
    if (condition === "story-progress-national-dex") return "Con Pokédex Nacional";
    if (condition === "story-progress-post-game") return "Post-Juego";
    return condition.replace("story-progress-", "Progreso: ").replace(/-/g, " ");
  }

  if (condition.startsWith("weekday-")) {
    const day = condition.replace("weekday-", "");
    const days: Record<string, string> = {
      monday: "Lunes", tuesday: "Martes", wednesday: "Miércoles",
      thursday: "Jueves", friday: "Viernes", saturday: "Sábado", sunday: "Domingo"
    };
    return `Día: ${days[day] || day}`;
  }

  return condition
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}
