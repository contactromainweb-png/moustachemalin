"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { etatScene } from "@/components/accueil/etat-scene";

// L'appartement vu à hauteur de chat : gamelle, fontaine, litière et arbre à chat posés au sol.
// Modèles génériques faits de formes simples (aucune reproduction d'un produit de marque).
// Échelle réelle, en mètres. La caméra reste entre 20 et 30 cm du sol.

const COULEURS = {
  creme: "#f3ebdf",
  peluche: "#efe6d8",
  caramel: "#84501f",
  sisal: "#c8a877",
  inox: "#c9c4bd",
  eau: "#a9cdd0",
  safran: "#f2a20c",
  ombre: "#2a1a0c",
};

// Position de chaque objet au sol.
const POSITIONS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1.1, 0, -0.1),
  new THREE.Vector3(2.5, 0, -0.25),
  new THREE.Vector3(4.3, 0, -0.55),
];
// Cadrage de chaque objet : distance de la caméra, hauteur de la caméra, hauteur visée.
const CADRAGES = [
  { distance: 1.05, camera: 0.2, vise: 0.06 },
  { distance: 1.25, camera: 0.22, vise: 0.12 },
  { distance: 1.95, camera: 0.26, vise: 0.26 },
  { distance: 3.0, camera: 0.3, vise: 0.62 },
];
// Où l'objet apparaît à l'écran (0 = bord gauche, 1 = bord droit) : loin de la carte de son chapitre.
const ECRAN_X = [0.63, 0.75, 0.28, 0.38];

// Couleur du mur à chaque objet : la même que l'aplat de son chapitre (voir globals.css).
const MURS = ["#e9dcc6", "#d8bf98", "#c49a68", "#a97a4b"].map((c) => new THREE.Color(c));

const lisse = (t: number) => t * t * (3 - 2 * t);
const melange = (a: number, b: number, t: number) => a + (b - a) * t;

function Camera() {
  const vise = useMemo(() => new THREE.Vector3(), []);
  const voulue = useMemo(() => new THREE.Vector3(), []);
  const regard = useMemo(() => new THREE.Vector3(0, 0.04, 0), []);
  const regardVoulu = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer, size }, delta) => {
    const p = THREE.MathUtils.clamp(etatScene.progres, 0, 3);
    const i = Math.min(Math.floor(p), 2);
    const t = lisse(p - i);
    const a = CADRAGES[i];
    const b = CADRAGES[i + 1];
    const distance = melange(a.distance, b.distance, t);
    const hauteur = melange(a.camera, b.camera, t);
    const ecranX = melange(ECRAN_X[i], ECRAN_X[i + 1], t);
    vise.lerpVectors(POSITIONS[i], POSITIONS[i + 1], t);
    vise.setY(melange(a.vise, b.vise, t));

    // Décalage latéral qui place l'objet à ecranX dans l'image.
    const cam = camera as THREE.PerspectiveCamera;
    const largeurVue = 2 * distance * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * (size.width / size.height);
    const decalage = (0.5 - ecranX) * largeurVue;

    // Léger mouvement de tête qui suit la souris.
    voulue.set(vise.x + decalage + pointer.x * 0.04 * distance, hauteur + pointer.y * 0.02 * distance, vise.z + distance);
    const k = 1 - Math.exp(-delta * 5);
    camera.position.lerp(voulue, k);
    regard.lerp(regardVoulu.set(vise.x + decalage, vise.y, vise.z), k);
    camera.lookAt(regard);
  });
  return null;
}

// Le coin d'appartement : parquet clair, mur dont la couleur suit le chapitre, plinthe.
function Piece() {
  const mur = useRef<THREE.MeshStandardMaterial>(null);
  const parquet = useMemo(() => {
    const toile = document.createElement("canvas");
    toile.width = 512;
    toile.height = 512;
    const c = toile.getContext("2d")!;
    // Huit lames de chêne clair, chacune d'un ton légèrement différent, joints plus foncés.
    const tons = ["#dcc49f", "#d6bc95", "#e0c9a5", "#d3b890", "#dac19b", "#ddc6a1", "#d5ba93", "#d9bf99"];
    tons.forEach((ton, n) => {
      c.fillStyle = ton;
      c.fillRect(0, n * 64, 512, 64);
      c.fillStyle = "#b99a70";
      c.fillRect(0, n * 64, 512, 2);
      c.fillRect(((n * 197) % 512) + 0, n * 64, 2, 64);
    });
    const texture = new THREE.CanvasTexture(toile);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 23); // lames de 12 cm de large, 2 m de long
    texture.anisotropy = 4;
    return texture;
  }, []);
  useEffect(() => () => parquet.dispose(), [parquet]);

  useFrame(() => {
    if (!mur.current) return;
    const p = THREE.MathUtils.clamp(etatScene.progres, 0, 3);
    const i = Math.min(Math.floor(p), 2);
    mur.current.color.lerpColors(MURS[i], MURS[i + 1], lisse(p - i));
  });

  return (
    <group>
      {/* Lames dans la profondeur : la texture tourne d'un quart de tour. */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 22]} />
        <meshStandardMaterial map={parquet} roughness={0.7} />
      </mesh>
      <mesh position={[2, 1.5, -1.05]} receiveShadow>
        <planeGeometry args={[22, 3]} />
        <meshStandardMaterial ref={mur} color={MURS[0]} roughness={0.95} />
      </mesh>
      <mesh position={[2, 0.04, -1.04]} receiveShadow>
        <boxGeometry args={[22, 0.08, 0.02]} />
        <meshStandardMaterial color="#f6efe4" roughness={0.6} />
      </mesh>
    </group>
  );
}

// Projecteur qui se déplace d'un objet à l'autre : l'objet du chapitre en cours « s'allume ».
function Projecteur() {
  const lampe = useRef<THREE.SpotLight>(null);
  const cible = useMemo(() => new THREE.Object3D(), []);
  const ici = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(etatScene.progres, 0, 3);
    const i = Math.min(Math.floor(p), 2);
    ici.lerpVectors(POSITIONS[i], POSITIONS[i + 1], lisse(p - i));
    const k = 1 - Math.exp(-delta * 4);
    cible.position.lerp(ici, k);
    if (lampe.current) lampe.current.position.set(cible.position.x - 0.6, 2.4, cible.position.z + 1.2);
  });

  return (
    <>
      <primitive object={cible} />
      <spotLight ref={lampe} target={cible} angle={0.42} penumbra={0.9} intensity={3.2} decay={0} color="#fff1dc" />
    </>
  );
}

// Enveloppe commune : survol (le pointeur devient une main, l'objet grossit un peu) et clic.
function Objet({ index, onChoisir, children }: { index: number; onChoisir: (i: number) => void; children: ReactNode }) {
  const groupe = useRef<THREE.Group>(null);
  const [survol, setSurvol] = useState(false);

  useEffect(() => {
    groupe.current?.traverse((o) => {
      o.castShadow = true;
    });
  }, []);

  useFrame((_, delta) => {
    if (!groupe.current) return;
    const s = THREE.MathUtils.damp(groupe.current.scale.x, survol ? 1.05 : 1, 10, delta);
    groupe.current.scale.setScalar(s);
  });

  return (
    <group
      ref={groupe}
      position={POSITIONS[index]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setSurvol(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setSurvol(false);
        document.body.style.cursor = "";
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onChoisir(index);
      }}
    >
      {children}
    </group>
  );
}

function profil(points: [number, number][]) {
  return points.map(([x, y]) => new THREE.Vector2(x, y));
}

function Gamelle() {
  const forme = useMemo(
    () =>
      new THREE.LatheGeometry(
        profil([
          [0, 0],
          [0.075, 0],
          [0.088, 0.006],
          [0.1, 0.046],
          [0.104, 0.052],
          [0.096, 0.052],
          [0.086, 0.014],
          [0, 0.014],
        ]),
        64,
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={forme}>
        <meshStandardMaterial color={COULEURS.caramel} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.092, 48]} />
        <meshStandardMaterial color={COULEURS.eau} roughness={0.08} transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

function Fontaine() {
  const vasque = useMemo(
    () =>
      new THREE.LatheGeometry(
        profil([
          [0, 0.12],
          [0.1, 0.12],
          [0.125, 0.135],
          [0.13, 0.155],
          [0.122, 0.155],
          [0.11, 0.132],
          [0, 0.132],
        ]),
        64,
      ),
    [],
  );
  const filet = useMemo(() => {
    const courbe = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.19, 0),
      new THREE.Vector3(0.025, 0.205, 0),
      new THREE.Vector3(0.05, 0.18, 0),
      new THREE.Vector3(0.062, 0.145, 0),
    ]);
    return new THREE.TubeGeometry(courbe, 24, 0.006, 8, false);
  }, []);
  const ronds = useRef<THREE.Group>(null);

  // Ronds dans l'eau là où tombe le filet.
  useFrame(({ clock }) => {
    ronds.current?.children.forEach((rond, n) => {
      const t = (clock.elapsedTime * 0.6 + n / 3) % 1;
      rond.scale.setScalar(0.3 + t * 1.6);
      ((rond as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.7 * (1 - t);
    });
  });

  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.095, 0.105, 0.12, 64]} />
        <meshStandardMaterial color={COULEURS.creme} roughness={0.5} />
      </mesh>
      <mesh geometry={vasque}>
        <meshStandardMaterial color={COULEURS.inox} metalness={0.6} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.146, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.118, 48]} />
        <meshStandardMaterial color={COULEURS.eau} roughness={0.05} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.165, 0]}>
        <cylinderGeometry args={[0.012, 0.016, 0.05, 24]} />
        <meshStandardMaterial color={COULEURS.inox} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh geometry={filet}>
        <meshStandardMaterial color={COULEURS.eau} roughness={0.05} transparent opacity={0.75} />
      </mesh>
      <group ref={ronds} position={[0.062, 0.148, 0]}>
        {[0, 1, 2].map((n) => (
          <mesh key={n} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.012, 0.015, 32]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Litiere() {
  const voyant = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (voyant.current) voyant.current.emissiveIntensity = 0.6 + 0.4 * Math.sin(clock.elapsedTime * 2.2);
  });
  return (
    <group>
      <RoundedBox args={[0.56, 0.13, 0.5]} radius={0.035} smoothness={4} position={[0, 0.065, 0]}>
        <meshStandardMaterial color={COULEURS.peluche} roughness={0.55} />
      </RoundedBox>
      {/* Dôme */}
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.25, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      {/* Entrée */}
      <mesh position={[0, 0.235, 0.236]} rotation={[-0.45, 0, 0]}>
        <circleGeometry args={[0.105, 48]} />
        <meshStandardMaterial color={COULEURS.ombre} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.235, 0.238]} rotation={[-0.45, 0, 0]}>
        <torusGeometry args={[0.108, 0.01, 12, 64]} />
        <meshStandardMaterial color={COULEURS.caramel} roughness={0.4} />
      </mesh>
      {/* Tiroir et voyant */}
      <mesh position={[0, 0.05, 0.252]}>
        <boxGeometry args={[0.22, 0.026, 0.008]} />
        <meshStandardMaterial color={COULEURS.caramel} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.377, 0.02]}>
        <sphereGeometry args={[0.012, 16, 16]} />
        <meshStandardMaterial ref={voyant} color={COULEURS.safran} emissive={COULEURS.safran} emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function ArbreAChat() {
  const pompon = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (pompon.current) pompon.current.rotation.z = Math.sin(clock.elapsedTime * 1.6) * 0.22;
  });
  const sisal = <meshStandardMaterial color={COULEURS.sisal} roughness={0.95} />;
  const peluche = <meshStandardMaterial color={COULEURS.peluche} roughness={1} />;
  return (
    <group>
      <RoundedBox args={[0.6, 0.04, 0.5]} radius={0.015} position={[0, 0.02, 0]}>
        {peluche}
      </RoundedBox>
      {/* Niche */}
      <RoundedBox args={[0.3, 0.28, 0.3]} radius={0.02} position={[0.13, 0.18, 0.05]}>
        {peluche}
      </RoundedBox>
      <mesh position={[0.13, 0.17, 0.201]}>
        <circleGeometry args={[0.075, 40]} />
        <meshStandardMaterial color={COULEURS.ombre} roughness={1} />
      </mesh>
      {/* Poteaux */}
      <mesh position={[-0.16, 0.42, -0.08]}>
        <cylinderGeometry args={[0.045, 0.045, 0.8, 32]} />
        {sisal}
      </mesh>
      <mesh position={[0.13, 0.735, 0.05]}>
        <cylinderGeometry args={[0.045, 0.045, 0.83, 32]} />
        {sisal}
      </mesh>
      {/* Plateformes */}
      <mesh position={[-0.16, 0.84, -0.08]}>
        <cylinderGeometry args={[0.17, 0.17, 0.045, 48]} />
        {peluche}
      </mesh>
      <mesh position={[0.13, 1.17, 0.05]}>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 48]} />
        {peluche}
      </mesh>
      {/* Pompon qui se balance */}
      <group ref={pompon} position={[-0.3, 0.82, -0.02]}>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.24, 6]} />
          <meshStandardMaterial color={COULEURS.caramel} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <sphereGeometry args={[0.03, 24, 24]} />
          <meshStandardMaterial color={COULEURS.safran} roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

type Props = {
  enMarche: boolean;
  onChoisir: (index: number) => void;
  onPret: () => void;
};

export default function Scene3D({ enMarche, onChoisir, onPret }: Props) {
  return (
    <Canvas
      flat
      shadows
      dpr={[1, 1.5]}
      frameloop={enMarche ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 38, near: 0.02, far: 30, position: [0.3, 0.2, 0.8] }}
      onCreated={onPret}
      className="pointer-events-auto"
    >
      <hemisphereLight args={["#fff6e8", "#8a6a48", 1.1]} />
      {/* Lumière de fenêtre, à gauche : c'est elle qui projette les ombres au sol. */}
      <directionalLight
        position={[-1.5, 3.2, 2.2]}
        intensity={1.3}
        color="#ffe9cc"
        castShadow
        shadow-mapSize={[2048, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-3}
        shadow-camera-right={4}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-far={12}
      >
        {/* Cible placée par rapport à la lumière : elle vise le milieu de la pièce (2,2 ; 0 ; -0,3). */}
        <object3D attach="target" position={[3.7, -3.2, -2.5]} />
      </directionalLight>
      <Piece />
      <Projecteur />
      <Camera />

      <Objet index={0} onChoisir={onChoisir}>
        <Gamelle />
      </Objet>
      <Objet index={1} onChoisir={onChoisir}>
        <Fontaine />
      </Objet>
      <Objet index={2} onChoisir={onChoisir}>
        <Litiere />
      </Objet>
      <Objet index={3} onChoisir={onChoisir}>
        <ArbreAChat />
      </Objet>
    </Canvas>
  );
}
