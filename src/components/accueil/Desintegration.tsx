import Image from "next/image";
import { PHOTOS } from "@/lib/medias";

const PHRASE = ["Un", "chat", "heureux", "tient", "à", "peu", "de", "choses."];
const MOT_SERIF = "heureux";

// Scène 2, sur fond bleu nuit (les particules claires y brillent) : la photo du chat blanc se désintègre en particules qui tourbillonnent, puis se reforment
// en un chaton qui boit, pendant que la phrase s'écrit mot par mot (voir Mouvement et particules.ts).
// Sans JavaScript ou avec « animations réduites » : la phrase entière et la première photo, immobiles.
// Téléphone, tablette, écran tactile (variante tactile:) : pas de particules ; la phrase et une autre photo, un chat
// dans un rayon de soleil (la première est déjà celle du premier écran), qui apparaissent en fondu (data-apparait).
export function Desintegration() {
  const { chatBlanc: a, chatonBol: b, chatSoleil: fixe } = PHOTOS;
  return (
    <section data-desintegration data-fond="nuit" aria-labelledby="titre-phrase" className="relative">
      <div
        data-desint-scene
        className="relative mx-auto grid max-w-[90rem] content-center gap-8 px-4 py-12 sm:px-8 lg:min-h-svh lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-12"
      >
        <h2 id="titre-phrase" data-apparait className="font-display text-[clamp(3rem,1.2rem+6vw,8rem)] lg:col-span-6 lg:max-w-[9ch]">
          {/* La phrase entière pour les lecteurs d'écran ; à l'écran, les mots séparés qui sortent du flou un par un
              au défilement (ils restent pâles tant que le visiteur n'est pas arrivé à la scène). */}
          <span className="sr-only">{PHRASE.join(" ")}</span>
          <span aria-hidden="true">
            {PHRASE.map((mot, i) => (
              <span key={mot}>
                <span data-mot className={`inline-block ${mot === MOT_SERIF ? "mot-serif" : ""}`}>
                  {mot}
                </span>
                {i < PHRASE.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        </h2>

        <figure data-apparait className="lg:col-span-6 lg:col-start-7" style={{ "--i": 2 } as React.CSSProperties}>
          <div
            data-desint-cadre
            className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] sm:aspect-[3/2] lg:aspect-auto lg:h-[min(76svh,48rem)]"
          >
            <Image
              src={fixe.src}
              alt={fixe.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={80}
              className="hidden object-cover object-[78%_45%] tactile:block"
            />
            <Image
              data-desint-b
              src={b.src}
              alt={b.alt}
              fill
              sizes="(min-width: 1024px) 75vw, 180vw"
              quality={80}
              className="object-cover opacity-0 tactile:hidden"
            />
            <Image
              data-desint-a
              src={a.src}
              alt={a.alt}
              fill
              sizes="(min-width: 1024px) 75vw, 180vw"
              quality={80}
              className="object-cover object-[50%_40%] tactile:hidden"
            />
          </div>
        </figure>

        {/* Les particules sont dessinées sur toute la scène : le tourbillon déborde du cadre. */}
        <canvas
          data-desint-canevas
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-0 tactile:hidden"
        />
      </div>
    </section>
  );
}
