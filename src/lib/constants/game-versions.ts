// Versiones oficiales de Pokémon con metadatos
export interface GameVersion {
  id: string;
  name: string;
  nameEs: string;
  generation: number;
  region: string;
  color: string;
  year: number;
  versionGroup: string;
}

export const GAME_VERSIONS: GameVersion[] = [
  // Gen 1
  { id: "red",         name: "red",         nameEs: "Pokémon Rojo",         generation: 1, region: "Kanto",   color: "#FF1111", year: 1996, versionGroup: "red-blue" },
  { id: "blue",        name: "blue",        nameEs: "Pokémon Azul",         generation: 1, region: "Kanto",   color: "#1111FF", year: 1996, versionGroup: "red-blue" },
  { id: "yellow",      name: "yellow",      nameEs: "Pokémon Amarillo",     generation: 1, region: "Kanto",   color: "#FFD700", year: 1998, versionGroup: "yellow" },
  // Gen 2
  { id: "gold",        name: "gold",        nameEs: "Pokémon Oro",          generation: 2, region: "Johto",   color: "#DAA520", year: 1999, versionGroup: "gold-silver" },
  { id: "silver",      name: "silver",      nameEs: "Pokémon Plata",        generation: 2, region: "Johto",   color: "#C0C0C0", year: 1999, versionGroup: "gold-silver" },
  { id: "crystal",     name: "crystal",     nameEs: "Pokémon Cristal",      generation: 2, region: "Johto",   color: "#88CCDD", year: 2000, versionGroup: "crystal" },
  // Gen 3
  { id: "ruby",        name: "ruby",        nameEs: "Pokémon Rubí",         generation: 3, region: "Hoenn",   color: "#CC0000", year: 2002, versionGroup: "ruby-sapphire" },
  { id: "sapphire",    name: "sapphire",    nameEs: "Pokémon Zafiro",       generation: 3, region: "Hoenn",   color: "#0000CC", year: 2002, versionGroup: "ruby-sapphire" },
  { id: "emerald",     name: "emerald",     nameEs: "Pokémon Esmeralda",    generation: 3, region: "Hoenn",   color: "#00AA44", year: 2004, versionGroup: "emerald" },
  { id: "firered",     name: "firered",     nameEs: "FireRed",              generation: 3, region: "Kanto",   color: "#FF6600", year: 2004, versionGroup: "firered-leafgreen" },
  { id: "leafgreen",   name: "leafgreen",   nameEs: "LeafGreen",            generation: 3, region: "Kanto",   color: "#00CC44", year: 2004, versionGroup: "firered-leafgreen" },
  // Gen 4
  { id: "diamond",     name: "diamond",     nameEs: "Pokémon Diamante",     generation: 4, region: "Sinnoh",  color: "#88AAFF", year: 2006, versionGroup: "diamond-pearl" },
  { id: "pearl",       name: "pearl",       nameEs: "Pokémon Perla",        generation: 4, region: "Sinnoh",  color: "#FFAACC", year: 2006, versionGroup: "diamond-pearl" },
  { id: "platinum",    name: "platinum",    nameEs: "Pokémon Platino",      generation: 4, region: "Sinnoh",  color: "#8888CC", year: 2008, versionGroup: "platinum" },
  { id: "heartgold",   name: "heartgold",   nameEs: "HeartGold",            generation: 4, region: "Johto",   color: "#FFAA00", year: 2009, versionGroup: "heartgold-soulsilver" },
  { id: "soulsilver",  name: "soulsilver",  nameEs: "SoulSilver",           generation: 4, region: "Johto",   color: "#AAAAEE", year: 2009, versionGroup: "heartgold-soulsilver" },
  // Gen 5
  { id: "black",       name: "black",       nameEs: "Pokémon Negro",        generation: 5, region: "Unova",   color: "#333333", year: 2010, versionGroup: "black-white" },
  { id: "white",       name: "white",       nameEs: "Pokémon Blanco",       generation: 5, region: "Unova",   color: "#EEEEEE", year: 2010, versionGroup: "black-white" },
  { id: "black-2",     name: "black-2",     nameEs: "Pokémon Negro 2",      generation: 5, region: "Unova",   color: "#222255", year: 2012, versionGroup: "black-2-white-2" },
  { id: "white-2",     name: "white-2",     nameEs: "Pokémon Blanco 2",     generation: 5, region: "Unova",   color: "#DDDDFF", year: 2012, versionGroup: "black-2-white-2" },
  // Gen 6
  { id: "x",           name: "x",           nameEs: "Pokémon X",            generation: 6, region: "Kalos",   color: "#0044FF", year: 2013, versionGroup: "x-y" },
  { id: "y",           name: "y",           nameEs: "Pokémon Y",            generation: 6, region: "Kalos",   color: "#FF0044", year: 2013, versionGroup: "x-y" },
  { id: "omega-ruby",  name: "omega-ruby",  nameEs: "Rubí Omega",           generation: 6, region: "Hoenn",   color: "#AA0000", year: 2014, versionGroup: "omega-ruby-alpha-sapphire" },
  { id: "alpha-sapphire", name: "alpha-sapphire", nameEs: "Zafiro Alfa",   generation: 6, region: "Hoenn",   color: "#0000AA", year: 2014, versionGroup: "omega-ruby-alpha-sapphire" },
  // Gen 7
  { id: "sun",         name: "sun",         nameEs: "Pokémon Sol",          generation: 7, region: "Alola",   color: "#FF8800", year: 2016, versionGroup: "sun-moon" },
  { id: "moon",        name: "moon",        nameEs: "Pokémon Luna",         generation: 7, region: "Alola",   color: "#220055", year: 2016, versionGroup: "sun-moon" },
  { id: "ultra-sun",   name: "ultra-sun",   nameEs: "UltraSol",             generation: 7, region: "Alola",   color: "#FF6600", year: 2017, versionGroup: "ultra-sun-ultra-moon" },
  { id: "ultra-moon",  name: "ultra-moon",  nameEs: "UtraLuna",             generation: 7, region: "Alola",   color: "#330066", year: 2017, versionGroup: "ultra-sun-ultra-moon" },
  { id: "lets-go-pikachu", name: "lets-go-pikachu", nameEs: "Let's Go Pikachu", generation: 7, region: "Kanto", color: "#FFD700", year: 2018, versionGroup: "lets-go-pikachu-lets-go-eevee" },
  { id: "lets-go-eevee",   name: "lets-go-eevee",   nameEs: "Let's Go Eevee",   generation: 7, region: "Kanto", color: "#AA6600", year: 2018, versionGroup: "lets-go-pikachu-lets-go-eevee" },
  // Gen 8
  { id: "sword",       name: "sword",       nameEs: "Pokémon Espada",       generation: 8, region: "Galar",   color: "#3366CC", year: 2019, versionGroup: "sword-shield" },
  { id: "shield",      name: "shield",      nameEs: "Pokémon Escudo",       generation: 8, region: "Galar",   color: "#CC3366", year: 2019, versionGroup: "sword-shield" },
  { id: "the-isle-of-armor-sword", name: "the-isle-of-armor-sword", nameEs: "Isla de la Armadura (Espada)", generation: 8, region: "Galar", color: "#3366CC", year: 2020, versionGroup: "the-isle-of-armor" },
  { id: "the-isle-of-armor-shield", name: "the-isle-of-armor-shield", nameEs: "Isla de la Armadura (Escudo)", generation: 8, region: "Galar", color: "#CC3366", year: 2020, versionGroup: "the-isle-of-armor" },
  { id: "the-crown-tundra-sword", name: "the-crown-tundra-sword", nameEs: "Nieves de la Corona (Espada)", generation: 8, region: "Galar", color: "#3366CC", year: 2020, versionGroup: "the-crown-tundra" },
  { id: "the-crown-tundra-shield", name: "the-crown-tundra-shield", nameEs: "Nieves de la Corona (Escudo)", generation: 8, region: "Galar", color: "#CC3366", year: 2020, versionGroup: "the-crown-tundra" },
  { id: "brilliant-diamond", name: "brilliant-diamond", nameEs: "Diamante Brillante", generation: 8, region: "Sinnoh", color: "#5599FF", year: 2021, versionGroup: "brilliant-diamond-and-shining-pearl" },
  { id: "shining-pearl",    name: "shining-pearl",    nameEs: "Perla Reluciente",   generation: 8, region: "Sinnoh", color: "#FF99CC", year: 2021, versionGroup: "brilliant-diamond-and-shining-pearl" },
  { id: "legends-arceus",   name: "legends-arceus",   nameEs: "Leyendas: Arceus",   generation: 8, region: "Hisui",  color: "#7744AA", year: 2022, versionGroup: "legends-arceus" },
  // Gen 9
  { id: "scarlet",     name: "scarlet",     nameEs: "Pokémon Escarlata",    generation: 9, region: "Paldea",  color: "#CC2200", year: 2022, versionGroup: "scarlet-violet" },
  { id: "violet",      name: "violet",      nameEs: "Pokémon Púrpura",      generation: 9, region: "Paldea",  color: "#6600CC", year: 2022, versionGroup: "scarlet-violet" },
  { id: "the-teal-mask-scarlet", name: "the-teal-mask-scarlet", nameEs: "La Máscara Turquesa (Escarlata)", generation: 9, region: "Kitakami", color: "#22B573", year: 2023, versionGroup: "the-hidden-treasure-of-area-zero" },
  { id: "the-teal-mask-violet", name: "the-teal-mask-violet", nameEs: "La Máscara Turquesa (Púrpura)", generation: 9, region: "Kitakami", color: "#22B573", year: 2023, versionGroup: "the-hidden-treasure-of-area-zero" },
  { id: "the-indigo-disk-scarlet", name: "the-indigo-disk-scarlet", nameEs: "El Disco Índigo (Escarlata)", generation: 9, region: "Academia Arándano", color: "#0071BC", year: 2023, versionGroup: "the-hidden-treasure-of-area-zero" },
  { id: "the-indigo-disk-violet", name: "the-indigo-disk-violet", nameEs: "El Disco Índigo (Púrpura)", generation: 9, region: "Academia Arándano", color: "#0071BC", year: 2023, versionGroup: "the-hidden-treasure-of-area-zero" },
];

export const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const GENERATION_NAMES: Record<number, string> = {
  1: "Generación I — Kanto",
  2: "Generación II — Johto",
  3: "Generación III — Hoenn",
  4: "Generación IV — Sinnoh",
  5: "Generación V — Unova",
  6: "Generación VI — Kalos",
  7: "Generación VII — Alola",
  8: "Generación VIII — Galar",
  9: "Generación IX — Paldea",
};

export const GENERATION_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

export function getVersionByName(name: string): GameVersion | undefined {
  return GAME_VERSIONS.find((v) => v.id === name || v.name === name);
}

export function getVersionsByGeneration(gen: number): GameVersion[] {
  return GAME_VERSIONS.filter((v) => v.generation === gen);
}
