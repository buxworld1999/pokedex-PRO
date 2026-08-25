import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6 float-animation">😵</div>
      <h1
        className="text-4xl font-black mb-3"
        style={{ fontFamily: "Outfit,sans-serif", color: "var(--text-primary)" }}
      >
        Pokémon no encontrado
      </h1>
      <p className="text-lg mb-8 max-w-md" style={{ color: "var(--text-secondary)" }}>
        Parece que ese Pokémon no existe en nuestra Pokédex. Verifica el nombre o número e inténtalo de nuevo.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          id="not-found-home"
          className="px-6 py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: "var(--poke-red)" }}
        >
          Ir al inicio
        </Link>
        <Link
          href="/pokedex"
          id="not-found-pokedex"
          className="px-6 py-3 rounded-xl font-bold transition-all"
          style={{
            background: "var(--poke-surface)",
            color: "var(--text-primary)",
            border: "1px solid var(--poke-border)",
          }}
        >
          Ver Pokédex completa
        </Link>
      </div>
    </div>
  );
}
