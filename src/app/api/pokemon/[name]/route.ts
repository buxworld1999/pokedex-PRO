import { NextRequest, NextResponse } from "next/server";
import { getPokemonDetails } from "@/lib/services/pokemon";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const data = await getPokemonDetails(name);

  if (!data) {
    return NextResponse.json(
      { error: "Pokémon no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
