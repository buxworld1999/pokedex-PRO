import { NextRequest, NextResponse } from "next/server";
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain, fetchPokemonEncounters } from "@/lib/api/pokeapi";
import { calculateTypeEffectiveness, calculateOffensiveEffectiveness } from "@/lib/utils/types";
import { processEncounters, findBestWay } from "@/lib/api/encounters";
import {
  formatPokemonName,
  getPokemonNameEs,
  getPokedexDescription,
  getGenusEs,
  getGenerationNumber,
  getRarity,
  formatGender,
  formatEggGroup,
} from "@/lib/utils/formatters";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const pokemonName = name.toLowerCase();

  try {
    // Fetch datos base en paralelo
    const [pokemon, species] = await Promise.all([
      fetchPokemon(pokemonName),
      fetchPokemonSpecies(pokemonName).catch(() => null),
    ]);

    // Evolución y encuentros en paralelo
    const evolutionChainId = species?.evolution_chain?.url
      ? parseInt(species.evolution_chain.url.split("/").filter(Boolean).pop() ?? "1")
      : null;

    const [evolutionChain, rawEncounters] = await Promise.all([
      evolutionChainId ? fetchEvolutionChain(evolutionChainId) : null,
      fetchPokemonEncounters(pokemon.id),
    ]);

    // Tipos del Pokémon
    const types = pokemon.types.map((t) => t.type.name);

    // Efectividad de tipos (defensiva y ofensiva en paralelo)
    const [typeEffectiveness, offensiveEffectiveness] = await Promise.all([
      calculateTypeEffectiveness(types),
      calculateOffensiveEffectiveness(types),
    ]);

    // Procesar encuentros
    const encounters = processEncounters(rawEncounters);
    const bestWay = findBestWay(encounters);

    // Stats procesados
    const statsMap: Record<string, number> = {};
    for (const s of pokemon.stats) {
      statsMap[s.stat.name] = s.base_stat;
    }

    // Nombre en español
    const nameEs = species ? getPokemonNameEs(species.names, pokemon.name) : formatPokemonName(pokemon.name);
    const description = species ? getPokedexDescription(species.flavor_text_entries) : "";
    const genus = species ? getGenusEs(species.genera) : "";
    const generation = species ? getGenerationNumber(species.generation.name) : 0;
    const rarity = species ? getRarity(species.capture_rate, species.is_legendary, species.is_mythical) : "Común";

    return NextResponse.json({
      // Identificadores
      id: pokemon.id,
      name: pokemon.name,
      nameEs,

      // Imágenes
      sprites: {
        official: pokemon.sprites.other["official-artwork"].front_default,
        officialShiny: pokemon.sprites.other["official-artwork"].front_shiny,
        home: pokemon.sprites.other.home?.front_default,
        homeShiny: pokemon.sprites.other.home?.front_shiny,
        default: pokemon.sprites.front_default,
        shiny: pokemon.sprites.front_shiny,
        showdown: pokemon.sprites.other.showdown?.front_default,
      },

      // Info básica
      height: pokemon.height,
      weight: pokemon.weight,
      baseExperience: pokemon.base_experience,
      types,
      genus,
      description,
      generation,
      rarity,

      // Especie
      isLegendary: species?.is_legendary ?? false,
      isMythical: species?.is_mythical ?? false,
      isBaby: species?.is_baby ?? false,
      captureRate: species?.capture_rate ?? 0,
      baseHappiness: species?.base_happiness ?? 0,
      hatchCounter: species?.hatch_counter ?? 0,
      gender: species ? formatGender(species.gender_rate) : "Desconocido",
      growthRate: species?.growth_rate.name ?? "",
      eggGroups: species ? species.egg_groups.map((g) => formatEggGroup(g.name)) : [],
      color: species?.color.name ?? "",

      // Habilidades
      abilities: pokemon.abilities.map((a) => ({
        name: a.ability.name,
        isHidden: a.is_hidden,
        slot: a.slot,
      })),

      // Stats
      stats: {
        hp: statsMap["hp"] ?? 0,
        attack: statsMap["attack"] ?? 0,
        defense: statsMap["defense"] ?? 0,
        specialAttack: statsMap["special-attack"] ?? 0,
        specialDefense: statsMap["special-defense"] ?? 0,
        speed: statsMap["speed"] ?? 0,
        total: Object.values(statsMap).reduce((a, b) => a + b, 0),
      },

      // Tipos y efectividad
      typeEffectiveness,
      offensiveEffectiveness,

      // Evolución
      evolutionChain: evolutionChain ?? null,

      // Ubicaciones
      encounters,
      bestWay,
    });
  } catch (error) {
    console.error(`Error fetching pokemon ${pokemonName}:`, error);
    return NextResponse.json(
      { error: "Pokémon no encontrado" },
      { status: 404 }
    );
  }
}
