// Scène 2 de l'accueil : une photo se désintègre en particules (ses propres pixels) qui tourbillonnent,
// puis se reforment en une autre photo. WebGL brut, sans bibliothèque : quelques Ko au lieu de Three.js.
// Chargé seulement quand la section approche (voir Mouvement), jamais sur les articles.

const VERTEX = `
attribute vec2 aMaison;   // position dans la photo, de 0 à 1
attribute vec3 aCouleurA;
attribute vec3 aCouleurB;
attribute vec4 aHasard;   // retard, sens et ampleur du tourbillon, phase
uniform float uProgres;   // 0 = photo A, 1 = photo B
uniform vec4 uCadre;      // x, y, largeur, hauteur de la photo, en pixels du canevas
uniform vec2 uCanevas;
uniform float uCellule;
varying vec3 vCouleur;
varying float vEnVol;

void main() {
  float d = aHasard.x * 0.3;
  // Envol de 0 à 0,5 puis retour de 0,5 à 1, chaque particule avec son petit retard.
  float envol = smoothstep(d, 0.5, uProgres) * (1.0 - smoothstep(0.5, 1.0 - d, uProgres));
  vec2 maison = uCadre.xy + aMaison * uCadre.zw;
  vec2 centre = uCadre.xy + 0.5 * uCadre.zw;
  vec2 v = maison - centre;
  float angle = envol * (2.2 + aHasard.y * 2.6) * (aHasard.z > 0.5 ? 1.0 : -1.0);
  float c = cos(angle), s = sin(angle);
  vec2 tourne = vec2(c * v.x - s * v.y, s * v.x + c * v.y) * (1.0 + envol * (0.25 + aHasard.z * 0.9));
  vec2 derive = vec2(sin(aHasard.w * 6.2831 + uProgres * 9.0), cos(aHasard.w * 6.2831 + uProgres * 7.0)) * envol * uCadre.w * 0.08;
  vec2 p = centre + tourne + derive;
  gl_Position = vec4(p / uCanevas * 2.0 - 1.0, 0.0, 1.0);
  gl_Position.y = -gl_Position.y;
  gl_PointSize = uCellule * mix(1.08, 0.55, envol);
  float bascule = smoothstep(0.42 + aHasard.x * 0.1, 0.58 + aHasard.x * 0.1, uProgres);
  vCouleur = mix(aCouleurA, aCouleurB, bascule);
  vEnVol = envol;
}`;

const FRAGMENT = `
precision mediump float;
varying vec3 vCouleur;
varying float vEnVol;
void main() {
  // Carrés jointifs au repos (la photo reste pleine), petits ronds en vol.
  if (vEnVol > 0.08 && length(gl_PointCoord - 0.5) > 0.5) discard;
  gl_FragColor = vec4(vCouleur, 1.0);
}`;

type Options = {
  canevas: HTMLCanvasElement;
  cadre: HTMLElement;
  imageA: HTMLImageElement;
  imageB: HTMLImageElement;
  colonnes: number;
};

// Lit les couleurs d'une image recadrée comme `object-fit: cover` dans un cadre de colonnes × rangées.
function echantillonner(image: HTMLImageElement, colonnes: number, rangees: number, position: [number, number]) {
  const c = document.createElement("canvas");
  c.width = colonnes;
  c.height = rangees;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  const ratioCadre = colonnes / rangees;
  const ratioImage = image.naturalWidth / image.naturalHeight;
  let sw = image.naturalWidth;
  let sh = image.naturalHeight;
  if (ratioImage > ratioCadre) sw = sh * ratioCadre;
  else sh = sw / ratioCadre;
  const sx = (image.naturalWidth - sw) * position[0];
  const sy = (image.naturalHeight - sh) * position[1];
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, colonnes, rangees);
  return ctx.getImageData(0, 0, colonnes, rangees).data;
}

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

// Renvoie de quoi dessiner une étape (progrès de 0 à 1), redimensionner et tout libérer ; null sans WebGL.
export function creerParticules({ canevas, cadre, imageA, imageB, colonnes }: Options) {
  const gl = canevas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;

  const programme = gl.createProgram()!;
  gl.attachShader(programme, shader(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(programme, shader(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(programme);
  gl.useProgram(programme);

  const boite = cadre.getBoundingClientRect();
  const rangees = Math.round(colonnes * (boite.height / boite.width));
  const n = colonnes * rangees;
  const A = echantillonner(imageA, colonnes, rangees, [0.5, 0.4]);
  const B = echantillonner(imageB, colonnes, rangees, [0.5, 0.5]);
  const maison = new Float32Array(n * 2);
  const couleurA = new Float32Array(n * 3);
  const couleurB = new Float32Array(n * 3);
  const hasard = new Float32Array(n * 4);
  for (let y = 0, i = 0; y < rangees; y++) {
    for (let x = 0; x < colonnes; x++, i++) {
      maison[i * 2] = (x + 0.5) / colonnes;
      maison[i * 2 + 1] = (y + 0.5) / rangees;
      for (let k = 0; k < 3; k++) {
        couleurA[i * 3 + k] = A[i * 4 + k] / 255;
        couleurB[i * 3 + k] = B[i * 4 + k] / 255;
      }
      for (let k = 0; k < 4; k++) hasard[i * 4 + k] = Math.random();
    }
  }
  const tampons: WebGLBuffer[] = [];
  const attribut = (nom: string, donnees: Float32Array, taille: number) => {
    const b = gl.createBuffer()!;
    tampons.push(b);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, donnees, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(programme, nom);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, taille, gl.FLOAT, false, 0, 0);
  };
  attribut("aMaison", maison, 2);
  attribut("aCouleurA", couleurA, 3);
  attribut("aCouleurB", couleurB, 3);
  attribut("aHasard", hasard, 4);

  const uProgres = gl.getUniformLocation(programme, "uProgres");
  const uCadre = gl.getUniformLocation(programme, "uCadre");
  const uCanevas = gl.getUniformLocation(programme, "uCanevas");
  const uCellule = gl.getUniformLocation(programme, "uCellule");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const redimensionner = () => {
    const zone = canevas.getBoundingClientRect();
    const c = cadre.getBoundingClientRect();
    canevas.width = Math.round(zone.width * dpr);
    canevas.height = Math.round(zone.height * dpr);
    gl.viewport(0, 0, canevas.width, canevas.height);
    gl.uniform2f(uCanevas, canevas.width, canevas.height);
    gl.uniform4f(uCadre, (c.left - zone.left) * dpr, (c.top - zone.top) * dpr, c.width * dpr, c.height * dpr);
    gl.uniform1f(uCellule, (c.width * dpr) / colonnes);
  };
  redimensionner();

  const dessiner = (progres: number) => {
    gl.uniform1f(uProgres, progres);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
  };

  const liberer = () => {
    tampons.forEach((b) => gl.deleteBuffer(b));
    gl.deleteProgram(programme);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  return { dessiner, redimensionner, liberer };
}
