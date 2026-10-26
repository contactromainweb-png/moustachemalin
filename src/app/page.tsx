import Bienvenue from "../../content/bienvenue.mdx";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Moustache Malin
      </h1>
      <div className="max-w-md text-lg leading-8 opacity-80">
        <Bienvenue />
      </div>
      <p className="text-sm opacity-60">Site en construction — à très bientôt.</p>
    </main>
  );
}
