import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatear nombre de Pokémon
export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Extraer ID de URL de PokéAPI
export function extractIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

// Formatear número de Pokédex (ej: 25 → #025)
export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

// Formatear altura (de decímetros a metros)
export function formatHeight(height: number): string {
  const meters = height / 10;
  const feet = Math.floor(meters * 3.281);
  const inches = Math.round((meters * 3.281 - feet) * 12);
  return `${meters.toFixed(1)} m (${feet}'${inches}")`;
}

// Formatear peso (de hectogramos a kg)
export function formatWeight(weight: number): string {
  const kg = weight / 10;
  const lbs = (kg * 2.205).toFixed(1);
  return `${kg.toFixed(1)} kg (${lbs} lbs)`;
}

// Formatear nombre de ubicación
export function formatLocationName(name: string): string {
  return name
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Obtener color de stat para barra de progreso
export function getStatColor(value: number): string {
  if (value < 50)  return "#EF4444"; // red
  if (value < 80)  return "#F97316"; // orange
  if (value < 100) return "#EAB308"; // yellow
  if (value < 130) return "#22C55E"; // green
  return "#3B82F6";                   // blue
}

// Nombre legible de stat
export const STAT_NAMES: Record<string, string> = {
  hp:              "PS",
  attack:          "Ataque",
  defense:         "Defensa",
  "special-attack": "At. Especial",
  "special-defense": "Def. Especial",
  speed:           "Velocidad",
};

// Determinar rareza del Pokémon
export function getRarity(captureRate: number, isLegendary: boolean, isMythical: boolean): string {
  if (isMythical)  return "Singular";
  if (isLegendary) return "Legendario";
  if (captureRate <= 3)   return "Muy raro";
  if (captureRate <= 45)  return "Raro";
  if (captureRate <= 100) return "Poco común";
  return "Común";
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "Singular":    return "text-pink-400";
    case "Legendario":  return "text-yellow-400";
    case "Muy raro":    return "text-purple-400";
    case "Raro":        return "text-blue-400";
    case "Poco común":  return "text-green-400";
    default:            return "text-gray-400";
  }
}

// Obtener número de generación del nombre
export function getGenerationNumber(generationName: string): number {
  const map: Record<string, number> = {
    "generation-i":    1,
    "generation-ii":   2,
    "generation-iii":  3,
    "generation-iv":   4,
    "generation-v":    5,
    "generation-vi":   6,
    "generation-vii":  7,
    "generation-viii": 8,
    "generation-ix":   9,
  };
  return map[generationName] ?? 1;
}

// Obtener ID del Pokémon de la URL de la especie
export function getPokemonIdFromSpeciesUrl(url: string): number {
  return extractIdFromUrl(url);
}

// Género basado en gender_rate (-1 = sin género, 0 = solo macho, 8 = solo hembra)
export function formatGender(genderRate: number): string {
  if (genderRate === -1) return "Sin género";
  if (genderRate === 0)  return "Solo ♂";
  if (genderRate === 8)  return "Solo ♀";
  const femalePercent = (genderRate / 8) * 100;
  return `♂ ${100 - femalePercent}% / ♀ ${femalePercent}%`;
}

// Formatear grupo huevo
export const EGG_GROUP_NAMES: Record<string, string> = {
  "monster":       "Monstruo",
  "water1":        "Agua 1",
  "water2":        "Agua 2",
  "water3":        "Agua 3",
  "bug":           "Bicho",
  "flying":        "Volador",
  "ground":        "Campo",
  "fairy":         "Hada",
  "plant":         "Planta",
  "humanshape":    "Humanoide",
  "mineral":       "Mineral",
  "indeterminate": "Amorfo",
  "ditto":         "Ditto",
  "dragon":        "Dragón",
  "no-eggs":       "Sin huevos",
};

export function formatEggGroup(name: string): string {
  return EGG_GROUP_NAMES[name] ?? formatPokemonName(name);
}

// Niveles de aparición
export function getLevelRange(encounters: { minLevel: number; maxLevel: number }[]): {
  min: number; max: number; avg: number;
} {
  if (!encounters.length) return { min: 0, max: 0, avg: 0 };
  const min = Math.min(...encounters.map((e) => e.minLevel));
  const max = Math.max(...encounters.map((e) => e.maxLevel));
  const avg = Math.round((min + max) / 2);
  return { min, max, avg };
}

// Obtener descripción de Pokédex en español (fallback a inglés)
export function getPokedexDescription(flavorTexts: { flavor_text: string; language: { name: string }; version: { name: string } }[]): string {
  const es = flavorTexts.find((f) => f.language.name === "es");
  if (es) return es.flavor_text.replace(/\n|\f/g, " ");
  const en = flavorTexts.find((f) => f.language.name === "en");
  if (en) return en.flavor_text.replace(/\n|\f/g, " ");
  return "Descripción no disponible.";
}

// Obtener nombre en español (fallback al nombre base)
export function getPokemonNameEs(names: { name: string; language: { name: string } }[], fallback: string): string {
  const es = names.find((n) => n.language.name === "es");
  if (es) return es.name;
  return formatPokemonName(fallback);
}

// Obtener género del Pokémon en español
export function getGenusEs(genera: { genus: string; language: { name: string } }[]): string {
  const es = genera.find((g) => g.language.name === "es");
  if (es) return es.genus;
  const en = genera.find((g) => g.language.name === "en");
  return en ? en.genus : "";
}

// Obtener habilidad en español (fallback al nombre base)
export function formatAbilityName(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
