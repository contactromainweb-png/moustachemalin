"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { BulleKira } from "@/components/BulleKira";
import { KiraDessin } from "@/components/KiraDessin";
import { oublierCarnet } from "@/lib/carnet";
import { enregistrerProfil, oublierProfil, PRENOM_MAX, useProfil, type ProfilChat } from "@/lib/profil";

// La carte « Ton chat » (pack de nuit 7) : sans profil, Kira se présente et le formulaire suit ; juste après la
// création, Kira dit bonjour au chat ; ensuite, une ligne compacte « Le profil de … · Modifier · Oublier ».
// Le prénom n'est jamais envoyé nulle part (ni à Umami ni ailleurs) : l'événement « profil-cree », envoyé après
// l'enregistrement, ne porte aucune donnée.
// Le champ du prénom n'a pas d'attribut name : même sans JavaScript, il ne pourrait pas partir dans une adresse.
type Fenetre = Window & { umami?: { track: (nom: string, donnees: Record<string, string>) => void } };
type Choix = { valeur: string; label: string };
const AGES: Choix[] = [
  { valeur: "chaton", label: "Chaton" },
  { valeur: "adulte", label: "Adulte" },
  { valeur: "senior", label: "Senior" },
];
const NB: Choix[] = [
  { valeur: "1", label: "Il est seul" },
  { valeur: "plusieurs", label: "Ils sont plusieurs" },
];
const DEHORS: Choix[] = [
  { valeur: "non", label: "Il reste dedans" },
  { valeur: "oui", label: "Il sort au jardin" },
];

const lien = "font-medium underline decoration-accent decoration-2 underline-offset-4 hover:text-ink-soft";

// `large` (accueil) : sur ordinateur, deux colonnes, Kira en grand (160 px) et sa bulle à gauche, le formulaire à
// droite ; sur téléphone, la même carte qu'ailleurs, avec Kira à 96 px.
// `surCarnet` (page /carnet/) : la page a déjà sa Kira, la carte n'en ajoute pas une deuxième une fois le profil
// créé, et le lien « Son carnet » disparaît (on y est déjà).
export function CarteProfil({
  className = "",
  large = false,
  surCarnet = false,
}: {
  className?: string;
  large?: boolean;
  surCarnet?: boolean;
}) {
  const profil = useProfil();
  const [edition, setEdition] = useState(false);
  const [cree, setCree] = useState(false);
  const [oubli, setOubli] = useState(false);

  const texteBulle = !profil ? (
    <p>
      Salut, moi c&apos;est Kira. Je rapporte mes jouets comme un chien et je bois au robinet. Et toi, ton chat, il
      s&apos;appelle comment&#8239;?
    </p>
  ) : cree && !edition && !surCarnet ? (
    <p>
      Enchantée, {profil.prenom}&#8239;! <Suite profil={profil} />
    </p>
  ) : null;

  const kira = texteBulle ? (
    <BulleKira vivante variante={large ? "accueil" : "ligne"} className="mb-6 lg:mb-0">
      {texteBulle}
    </BulleKira>
  ) : large ? (
    <div className="hidden lg:block">
      <KiraDessin taille={160} className="size-40" />
    </div>
  ) : null;

  const contenu =
    !profil || edition ? (
      <Formulaire
        profil={edition ? profil : null}
        onFini={() => {
          setEdition(false);
          setCree(true);
        }}
        onAnnuler={edition ? () => setEdition(false) : undefined}
      />
    ) : oubli ? (
      <p role="group" aria-label="Oublier le profil" className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>Oublier le profil et le carnet de {profil.prenom}&#8239;?</span>
        <button
          type="button"
          className="min-h-11 rounded-full bg-nuit px-4 font-medium text-blanc"
          onClick={() => {
            oublierProfil();
            oublierCarnet();
            setOubli(false);
            setCree(false);
          }}
        >
          Oui, oublier
        </button>
        <button type="button" className={`min-h-11 ${lien}`} onClick={() => setOubli(false)}>
          Non, le garder
        </button>
      </p>
    ) : (
      <p className="flex flex-wrap items-center gap-x-2">
        <span className="font-medium">Le profil de {profil.prenom}</span>
        {surCarnet ? null : (
          <>
            <span aria-hidden="true">·</span>
            <Link href="/carnet/" className={`flex min-h-11 items-center ${lien}`}>
              Son carnet
            </Link>
          </>
        )}
        <span aria-hidden="true">·</span>
        <button type="button" className={`min-h-11 ${lien}`} onClick={() => setEdition(true)}>
          Modifier
        </button>
        <span aria-hidden="true">·</span>
        <button type="button" className={`min-h-11 ${lien}`} onClick={() => setOubli(true)}>
          Oublier
        </button>
      </p>
    );

  return (
    <div
      className={`${className} ${large ? "lg:grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-14" : ""}`}
    >
      {kira}
      <div className="min-w-0">{contenu}</div>
    </div>
  );
}

// La phrase de Kira juste après la création, selon le profil (textes du pack de nuit 7).
function Suite({ profil }: { profil: ProfilChat }) {
  if (profil.nbChats === "plusieurs") {
    return (
      <>
        Plusieurs chats&#8239;? Alors <Link href="/outils/combien-de-litieres/">on compte les litières</Link>&#8239;: une par
        chat, plus une.
      </>
    );
  }
  if (profil.dehors === "oui") {
    return (
      <>
        Un aventurier&#8239;! <Link href="/sorties/chatiere/">Les chatières</Link>, c&apos;est par ici.
      </>
    );
  }
  return <>Un chat d&apos;intérieur, comme moi. On va lui faire un appart de rêve.</>;
}

function Formulaire({
  profil,
  onFini,
  onAnnuler,
}: {
  profil: ProfilChat | null;
  onFini: () => void;
  onAnnuler?: () => void;
}) {
  const id = useId();
  const [prenom, setPrenom] = useState(profil?.prenom ?? "");
  const [age, setAge] = useState(profil?.age ?? "");
  const [nbChats, setNbChats] = useState(profil?.nbChats ?? "");
  const [dehors, setDehors] = useState(profil?.dehors ?? "");
  const [erreur, setErreur] = useState("");

  const valider = (e: FormEvent) => {
    e.preventDefault();
    if (!prenom.trim()) return setErreur("Donne-lui un prénom d'abord.");
    if (!age || !nbChats || !dehors) return setErreur("Réponds aux 3 questions.");
    setErreur("");
    const stocke = enregistrerProfil({
      prenom,
      age: age as ProfilChat["age"],
      nbChats: nbChats as ProfilChat["nbChats"],
      dehors: dehors as ProfilChat["dehors"],
    });
    // Statistiques : « profil-cree » seulement à la création, et seulement si le profil est vraiment enregistré
    // (stockage du navigateur accepté). Aucune donnée n'accompagne l'événement, jamais le prénom.
    if (!profil && stocke) (window as Fenetre).umami?.track("profil-cree", {});
    onFini();
  };

  return (
    <>
      <form onSubmit={valider} noValidate className="space-y-5">
        <div>
          <label htmlFor={`${id}-prenom`} className="mb-2 block font-semibold">
            Son prénom
          </label>
          <input
            id={`${id}-prenom`}
            type="text"
            autoComplete="off"
            maxLength={PRENOM_MAX}
            placeholder="Mochi"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            aria-invalid={erreur.startsWith("Donne") || undefined}
            aria-describedby={erreur ? `${id}-erreur` : undefined}
            className="min-h-12 w-full max-w-[20rem] rounded-xl border-[1.5px] border-nuit/40 bg-white px-4 text-nuit placeholder:text-[#6b6660] focus-visible:border-nuit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <Groupe titre="Son âge" nom={`${id}-age`} choix={AGES} valeur={age} onChange={setAge} />
        <Groupe titre="À la maison" nom={`${id}-nb`} choix={NB} valeur={nbChats} onChange={setNbChats} />
        <Groupe titre="Dehors ?" nom={`${id}-dehors`} choix={DEHORS} valeur={dehors} onChange={setDehors} />
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="min-h-12 rounded-full bg-accent px-6 font-semibold text-on-accent transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              {profil ? "Enregistrer" : "Créer son profil"}
            </button>
            {onAnnuler ? (
              <button type="button" className={`min-h-11 ${lien}`} onClick={onAnnuler}>
                Annuler
              </button>
            ) : null}
          </div>
          <p id={`${id}-erreur`} role="alert" className="mt-3 min-h-[1.5em] font-medium text-[#b42318]">
            {erreur}
          </p>
          <p className="text-small text-ink-soft">
            Ça reste dans ton navigateur&#8239;: pas de compte, pas de cookie. Le site s&apos;en sert aussi pour tenir son
            carnet.{" "}
            <Link href="/confidentialite/#profil-du-chat" className={lien}>
              En savoir plus
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

// Pastilles à choix unique : de vrais boutons radio (flèches du clavier, lecteurs d'écran), habillés en pastilles.
function Groupe({
  titre,
  nom,
  choix,
  valeur,
  onChange,
}: {
  titre: string;
  nom: string;
  choix: Choix[];
  valeur: string;
  onChange: (v: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{titre.replace(" ?", " ?")}</legend>
      <div className="flex flex-wrap gap-2">
        {choix.map((c) => (
          <label key={c.valeur} className="relative">
            <input
              type="radio"
              name={nom}
              value={c.valeur}
              checked={valeur === c.valeur}
              onChange={() => onChange(c.valeur)}
              className="peer sr-only"
            />
            <span className="flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-nuit/30 bg-white px-4 font-medium text-nuit transition-colors duration-150 hover:border-nuit peer-checked:border-nuit peer-checked:bg-nuit peer-checked:text-blanc peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent motion-reduce:transition-none">
              {c.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
