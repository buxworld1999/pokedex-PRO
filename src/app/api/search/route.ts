import { NextResponse } from "next/server";
import { fetchPokemonList } from "@/lib/api/pokeapi";

let cachedList: { name: string; id: number }[] | null = null;

export async function GET() {
  try {
    if (!cachedList) {
      const list = await fetchPokemonList(1025, 0);
      cachedList = list.map((p) => ({
        name: p.name,
        id: p.id,
      }));
    }

    return NextResponse.json(
      { pokemon: cachedList },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching pokemon list:", error);
    return NextResponse.json({ error: "Error al obtener lista" }, { status: 500 });
  }
}
