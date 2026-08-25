// Cálculo de efectividades de tipo contra un Pokémon
import { TypeData, TypeEffectiveness } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

// Cache simple en memoria
const typeCache: Record<string, TypeData> = {};

export async function fetchTypeData(typeName: string): Promise<TypeData> {
  if (typeCache[typeName]) return typeCache[typeName];
  const res = await fetch(`${BASE_URL}/type/${typeName}`, {
    next: { revalidate: 86400 }, // 24h
  });
  if (!res.ok) throw new Error(`Failed to fetch type: ${typeName}`);
  const data = await res.json();
  typeCache[typeName] = data;
  return data;
}

export async function calculateTypeEffectiveness(
  pokemonTypes: string[]
): Promise<TypeEffectiveness> {
  const allTypes = [
    "normal","fire","water","electric","grass","ice","fighting","poison",
    "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy",
  ];

  const effectiveness: Record<string, number> = {};
  for (const t of allTypes) effectiveness[t] = 1;

  for (const defenderType of pokemonTypes) {
    const typeData = await fetchTypeData(defenderType);
    const dr = typeData.damage_relations;

    for (const t of dr.no_damage_from)    effectiveness[t.name] *= 0;
    for (const t of dr.half_damage_from)  effectiveness[t.name] *= 0.5;
    for (const t of dr.double_damage_from) effectiveness[t.name] *= 2;
  }

  const result: TypeEffectiveness = {
    immune:    [],
    quarter:   [],
    half:      [],
    neutral:   [],
    double:    [],
    quadruple: [],
  };

  for (const [type, value] of Object.entries(effectiveness)) {
    if (value === 0)    result.immune.push(type);
    else if (value === 0.25) result.quarter.push(type);
    else if (value === 0.5) result.half.push(type);
    else if (value === 1)   result.neutral.push(type);
    else if (value === 2)   result.double.push(type);
    else if (value === 4)   result.quadruple.push(type);
  }

  return result;
}

// Efectividad OFENSIVA — qué tipos este Pokémon golpea con ventaja
// Combina los multiplicadores de todos sus tipos de ataque (STAB)
export async function calculateOffensiveEffectiveness(
  pokemonTypes: string[]
): Promise<TypeEffectiveness> {
  const allTypes = [
    "normal","fire","water","electric","grass","ice","fighting","poison",
    "ground","flying","psychic","bug","rock","ghost","dragon","dark","steel","fairy",
  ];

  // Para cada tipo defensor, calcula el daño máximo que puede hacer este Pokémon
  // usando el mejor de sus tipos de ataque
  const maxEffectiveness: Record<string, number> = {};
  for (const t of allTypes) maxEffectiveness[t] = 1;

  for (const atkType of pokemonTypes) {
    const typeData = await fetchTypeData(atkType);
    const dr = typeData.damage_relations;

    // Calculamos el multiplicador de este tipo atacante contra cada defensor
    const atkMult: Record<string, number> = {};
    for (const t of allTypes) atkMult[t] = 1;
    for (const t of dr.no_damage_to)      atkMult[t.name] = 0;
    for (const t of dr.half_damage_to)    atkMult[t.name] = 0.5;
    for (const t of dr.double_damage_to)  atkMult[t.name] = 2;

    // Tomamos el mejor multiplicador entre todos los tipos del Pokémon
    for (const defender of allTypes) {
      if (atkMult[defender] > maxEffectiveness[defender]) {
        maxEffectiveness[defender] = atkMult[defender];
      }
    }
  }

  const result: TypeEffectiveness = {
    immune:    [],
    quarter:   [],
    half:      [],
    neutral:   [],
    double:    [],
    quadruple: [],
  };

  for (const [type, value] of Object.entries(maxEffectiveness)) {
    if (value === 0)    result.immune.push(type);
    else if (value === 0.25) result.quarter.push(type);
    else if (value === 0.5) result.half.push(type);
    else if (value === 1)   result.neutral.push(type);
    else if (value === 2)   result.double.push(type);
    else if (value === 4)   result.quadruple.push(type);
  }

  return result;
}

