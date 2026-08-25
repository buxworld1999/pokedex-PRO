// Funciones de fetch a PokéAPI con caché de Next.js
import type {
  Pokemon,
  PokemonSpecies,
  EvolutionChain,
  PokemonEncounter,
  PokemonListItem,
} from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

// Fetch genérico con caché ISR de Next.js
async function apiFetch<T>(url: string, revalidate = 3600): Promise<T> {
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`PokéAPI error: ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

// Pokemon principal
export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
  return apiFetch<Pokemon>(`${BASE_URL}/pokemon/${nameOrId}`, 3600);
}

// Especie del Pokémon (descripción, generación, etc.)
export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
  return apiFetch<PokemonSpecies>(`${BASE_URL}/pokemon-species/${nameOrId}`, 3600);
}

// Cadena evolutiva
export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
  return apiFetch<EvolutionChain>(`${BASE_URL}/evolution-chain/${id}`, 86400);
}

// Ubicaciones de encuentro (por versión del juego)
export async function fetchPokemonEncounters(nameOrId: string | number): Promise<PokemonEncounter[]> {
  return apiFetch<PokemonEncounter[]>(`${BASE_URL}/pokemon/${nameOrId}/encounters`, 3600);
}

// Lista completa de Pokémon (para búsqueda/autocompletado)
export async function fetchPokemonList(limit = 1025, offset = 0): Promise<PokemonListItem[]> {
  const data = await apiFetch<{ results: { name: string; url: string }[] }>(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`,
    86400
  );
  return data.results.map((p, i) => ({
    name: p.name,
    url: p.url,
    id: offset + i + 1,
  }));
}

// Pokémon de una generación
export async function fetchGenerationPokemon(genId: number): Promise<string[]> {
  const data = await apiFetch<{ pokemon_species: { name: string; url: string }[] }>(
    `${BASE_URL}/generation/${genId}`,
    86400
  );
  return data.pokemon_species.map((p) => p.name);
}

// Location area (para nombre legible)
export async function fetchLocationArea(nameOrId: string): Promise<{ 
  name: string;
  location: { name: string; url: string };
  names: { name: string; language: { name: string } }[];
}> {
  return apiFetch(`${BASE_URL}/location-area/${nameOrId}`, 86400);
}

// Region
export async function fetchRegion(nameOrId: string | number): Promise<{
  name: string;
  names: { name: string; language: { name: string } }[];
  locations: { name: string; url: string }[];
  main_generation: { name: string; url: string };
}> {
  return apiFetch(`${BASE_URL}/region/${nameOrId}`, 86400);
}
