import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import PokemonHero from "@/components/pokemon/PokemonHero";
import StatsSection from "@/components/pokemon/StatsSection";
import WeaknessGrid from "@/components/pokemon/WeaknessGrid";
import EvolutionChainSection from "@/components/pokemon/EvolutionChainSection";
import LocationTable from "@/components/pokemon/LocationTable";
import BestWayCard from "@/components/pokemon/BestWayCard";
import CollectorInfo from "@/components/pokemon/CollectorInfo";
import { TYPE_COLORS } from "@/lib/constants/type-colors";

// Server-side data fetch
async function getPokemonData(name: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  try {
    const res = await fetch(`${baseUrl}/api/pokemon/${name}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const data = await getPokemonData(name);
  if (!data) return { title: "Pokémon no encontrado" };

  return {
    title: `${data.nameEs} — #${String(data.id).padStart(3, "0")} | PokéDex Pro`,
    description: `${data.nameEs}: ${data.description || `Pokémon de tipo ${data.types.join("/")} de la Generación ${data.generation}.`} Estadísticas, ubicaciones, evoluciones y más.`,
    openGraph: {
      title: `${data.nameEs} | PokéDex Pro`,
      description: data.description,
      images: data.sprites.official ? [{ url: data.sprites.official }] : [],
    },
  };
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const data = await getPokemonData(name.toLowerCase());

  if (!data) {
    notFound();
  }

  const primaryType = data.types[0] ?? "normal";
  const typeColor = TYPE_COLORS[primaryType]?.hex ?? "#888";

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="pokemon-detail-page">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
          <a href="/" style={{ color: "var(--text-muted)" }}>Inicio</a>
          <span>/</span>
          <a href="/pokedex" style={{ color: "var(--text-muted)" }}>Pokédex</a>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{data.nameEs}</span>
        </nav>

        {/* Hero */}
        <PokemonHero
          id={data.id}
          name={data.name}
          nameEs={data.nameEs}
          types={data.types}
          sprites={data.sprites}
          height={data.height}
          weight={data.weight}
          genus={data.genus}
          description={data.description}
          generation={data.generation}
          rarity={data.rarity}
          abilities={data.abilities}
          isLegendary={data.isLegendary}
          isMythical={data.isMythical}
          gender={data.gender}
          color={data.color}
        />

        {/* Stats */}
        <StatsSection stats={data.stats} typeColor={typeColor} />

        {/* Weakness grid */}
        <WeaknessGrid
          effectiveness={data.typeEffectiveness}
          offensiveEffectiveness={data.offensiveEffectiveness}
          pokemonTypes={data.types}
        />

        {/* Evolution chain */}
        {data.evolutionChain && (
          <EvolutionChainSection
            evolutionChain={data.evolutionChain}
            currentPokemonName={data.name}
          />
        )}

        {/* ===== SECCIÓN: DÓNDE CONSEGUIR ===== */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--poke-surface)", border: "2px solid rgba(204,0,0,0.2)" }}
          id="donde-conseguir"
        >
          <div
            className="p-6 border-b"
            style={{
              borderColor: "rgba(204,0,0,0.2)",
              background: "linear-gradient(135deg, rgba(204,0,0,0.08), transparent)",
            }}
          >
            <h2
              className="text-2xl font-black flex items-center gap-2"
              style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
            >
              🎯 Dónde Conseguir este Pokémon
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Todas las formas de obtener a <strong style={{ color: "var(--text-primary)" }}>{data.nameEs}</strong> en los videojuegos Pokémon
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Best way */}
            <BestWayCard
              bestWay={data.bestWay}
              pokemonNameEs={data.nameEs}
              encounters={data.encounters}
              isEvolution={!!data.evolutionChain?.chain?.evolves_to?.length}
            />

            {/* Location table */}
            <LocationTable encounters={data.encounters} />
          </div>
        </div>

        {/* Collector info */}
        <CollectorInfo
          rarity={data.rarity}
          captureRate={data.captureRate}
          isLegendary={data.isLegendary}
          isMythical={data.isMythical}
          isBaby={data.isBaby}
          eggGroups={data.eggGroups}
          hatchCounter={data.hatchCounter}
          baseHappiness={data.baseHappiness}
          growthRate={data.growthRate}
          color={data.color}
          encounters={data.encounters}
        />

        {/* Footer spacer */}
        <div className="h-8" />
      </main>
    </>
  );
}
