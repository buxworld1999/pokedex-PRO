// TypeScript interfaces para datos de PokéAPI

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: { name: string; url: string };
  version_group_details: {
    level_learned_at: number;
    move_learn_method: { name: string };
    version_group: { name: string };
  }[];
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  back_shiny: string | null;
  other: {
    "official-artwork": {
      front_default: string | null;
      front_shiny: string | null;
    };
    home: {
      front_default: string | null;
      front_shiny: string | null;
    };
    showdown?: {
      front_default: string | null;
      back_default: string | null;
    };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  sprites: PokemonSprites;
  location_area_encounters: string;
  species: { name: string; url: string };
  cries: { latest: string; legacy: string };
}

// Species
export interface FlavorText {
  flavor_text: string;
  language: { name: string };
  version: { name: string };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: { name: string };
  pokedex_numbers: { entry_number: number; pokedex: { name: string } }[];
  egg_groups: { name: string }[];
  color: { name: string };
  shape: { name: string };
  evolves_from_species: { name: string; url: string } | null;
  evolution_chain: { url: string };
  generation: { name: string };
  names: { name: string; language: { name: string } }[];
  flavor_text_entries: FlavorText[];
  genera: { genus: string; language: { name: string } }[];
  varieties: { is_default: boolean; pokemon: { name: string; url: string } }[];
}

// Evolution
export interface EvolutionDetail {
  item: { name: string } | null;
  trigger: { name: string };
  gender: number | null;
  held_item: { name: string } | null;
  known_move: { name: string } | null;
  known_move_type: { name: string } | null;
  location: { name: string } | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: { name: string } | null;
  party_type: { name: string } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: { name: string } | null;
  turn_upside_down: boolean;
}

export interface EvolutionChainLink {
  is_baby: boolean;
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainLink[];
}

export interface EvolutionChain {
  id: number;
  baby_trigger_item: { name: string } | null;
  chain: EvolutionChainLink;
}

// Encounters
export interface EncounterVersionDetail {
  rate: number;
  version: { name: string; url: string };
}

export interface EncounterMethodRate {
  encounter_method: { name: string; url: string };
  version_details: EncounterVersionDetail[];
}

export interface PokemonEncounter {
  location_area: { name: string; url: string };
  version_details: {
    version: { name: string; url: string };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      condition_values: { name: string; url: string }[];
      chance: number;
      method: { name: string; url: string };
    }[];
  }[];
}

// Type effectiveness
export interface TypeRelations {
  no_damage_to: { name: string }[];
  half_damage_to: { name: string }[];
  double_damage_to: { name: string }[];
  no_damage_from: { name: string }[];
  half_damage_from: { name: string }[];
  double_damage_from: { name: string }[];
}

export interface TypeData {
  id: number;
  name: string;
  damage_relations: TypeRelations;
}

// Processed data for UI
export interface ProcessedStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  total: number;
}

export interface TypeEffectiveness {
  immune: string[];      // x0
  quarter: string[];     // x0.25
  half: string[];        // x0.5
  neutral: string[];     // x1
  double: string[];      // x2
  quadruple: string[];   // x4
}

export interface EvolutionStep {
  name: string;
  id: number;
  sprite: string;
  details: EvolutionDetail | null;
  level?: number;
  trigger?: string;
}

export interface LocationEncounter {
  locationArea: string;
  locationName: string;
  regionName: string;
  versions: {
    versionName: string;
    versionNameEs: string;
    generation: number;
    maxChance: number;
    details: {
      minLevel: number;
      maxLevel: number;
      chance: number;
      method: string;
      conditions: string[];
    }[];
  }[];
}

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
}

// Summary card for search results and listings
export interface PokemonSummary {
  id: number;
  name: string;
  nameEs?: string;
  types: string[];
  sprite: string;
  artwork: string;
  stats: ProcessedStats;
  generation: number;
  color: string;
}
