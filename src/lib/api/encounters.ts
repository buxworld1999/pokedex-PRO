// Lógica para procesar datos de encuentros de PokéAPI
import type { PokemonEncounter, LocationEncounter } from "@/types/pokemon";
import { GAME_VERSIONS } from "@/lib/constants/game-versions";

// Mapeo de áreas a regiones
const AREA_REGION_MAP: Record<string, string> = {
  "kanto": "Kanto",
  "johto": "Johto",
  "hoenn": "Hoenn",
  "sinnoh": "Sinnoh",
  "unova": "Unova",
  "kalos": "Kalos",
  "alola": "Alola",
  "galar": "Galar",
  "hisui": "Hisui",
  "paldea": "Paldea",
};

function guessRegion(locationAreaName: string): string {
  for (const [key, region] of Object.entries(AREA_REGION_MAP)) {
    if (locationAreaName.includes(key)) return region;
  }
  // Inferir por prefijo o contenido
  if (locationAreaName.includes("route-") && parseInt(locationAreaName.split("-")[1]) <= 28) return "Kanto/Johto";
  return "Desconocida";
}

export function formatLocationAreaName(name: string): string {
  return name
    .replace(/-area$/, "")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function processEncounters(rawEncounters: PokemonEncounter[]): LocationEncounter[] {
  const result: LocationEncounter[] = [];

  for (const enc of rawEncounters) {
    const locationName = formatLocationAreaName(enc.location_area.name);
    const regionName = guessRegion(enc.location_area.name.toLowerCase());

    const versions: LocationEncounter["versions"] = [];

    for (const vd of enc.version_details) {
      const versionInfo = GAME_VERSIONS.find((v) => v.id === vd.version.name);

      versions.push({
        versionName: vd.version.name,
        versionNameEs: versionInfo?.nameEs ?? vd.version.name,
        generation: versionInfo?.generation ?? 0,
        maxChance: vd.max_chance,
        details: vd.encounter_details.map((ed) => ({
          minLevel: ed.min_level,
          maxLevel: ed.max_level,
          chance: ed.chance,
          method: ed.method.name,
          conditions: ed.condition_values.map((c) => c.name),
        })),
      });
    }

    result.push({
      locationArea: enc.location_area.name,
      locationName,
      regionName,
      versions,
    });
  }

  return result;
}

// Encontrar la mejor opción para conseguir el Pokémon
export interface BestWay {
  versionNameEs: string;
  versionName: string;
  locationName: string;
  maxChance: number;
  minLevel: number;
  method: string;
  reason: string;
}

export function findBestWay(encounters: LocationEncounter[]): BestWay | null {
  if (!encounters.length) return null;

  let best: BestWay | null = null;
  let bestScore = -1;

  for (const loc of encounters) {
    for (const ver of loc.versions) {
      for (const det of ver.details) {
        // Score = probabilidad alta + nivel bajo
        const score = ver.maxChance * 10 - det.minLevel;
        if (score > bestScore) {
          bestScore = score;
          best = {
            versionName: ver.versionName,
            versionNameEs: ver.versionNameEs,
            locationName: loc.locationName,
            maxChance: ver.maxChance,
            minLevel: det.minLevel,
            method: det.method,
            reason: buildReason(ver.maxChance, det.minLevel, ver.versionNameEs),
          };
        }
      }
    }
  }

  return best;
}

function buildReason(chance: number, minLevel: number, version: string): string {
  const parts: string[] = [];
  if (chance >= 20) parts.push("Alta frecuencia de aparición");
  else if (chance >= 10) parts.push("Frecuencia de aparición moderada");
  else parts.push("Aparece con probabilidad baja");

  if (minLevel <= 10) parts.push("Disponible a nivel muy bajo");
  else if (minLevel <= 20) parts.push("Nivel accesible para principiantes");
  else parts.push(`Nivel mínimo de ${minLevel}`);

  return parts.join(". ") + ".";
}

// Verificar si es exclusivo de versión
export function getExclusiveVersions(encounters: LocationEncounter[]): string[] {
  const allVersions = new Set<string>();
  for (const loc of encounters) {
    for (const ver of loc.versions) {
      allVersions.add(ver.versionNameEs);
    }
  }
  return [...allVersions];
}
