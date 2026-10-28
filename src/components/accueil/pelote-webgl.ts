// Scène 4 de l'accueil : une pelote de laine abstraite, faite de fils lumineux en particules autour d'un cœur
// orange, qui tourne doucement. WebGL brut (quelques Ko), dessiné seulement quand la section est à l'écran.
// Forme abstraite : aucun objet modélisé, aucun produit.

const VERTEX = `
attribute vec3 aPos;      // point sur la pelote (sphère de rayon 1)
attribute vec3 aCouleur;
attribute float aTaille;
uniform mat3 uRot;
uniform vec2 uCanevas;
uniform float uRayon;
uniform float uDpr;
varying vec3 vCouleur;
varying float vAlpha;
void main() {
  vec3 p = uRot * aPos;
  float persp = 1.0 / (1.6 - p.z * 0.45);
  vec2 ecran = p.xy * uRayon * persp * 1.6;
  gl_Position = vec4(ecran / (uCanevas * 0.5), 0.0, 1.0);
  gl_PointSize = aTaille * uDpr * persp * 1.6;
  // Les fils de l'arrière s'estompent : la pelote prend du relief.
  vAlpha = 0.18 + 0.82 * smoothstep(-1.0, 1.0, p.z);
  vCouleur = aCouleur;
}`;

const FRAGMENT = `
precision mediump float;
varying vec3 vCouleur;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  // Couleur prémultipliée : une particule pâle laisse voir le bleu nuit derrière elle, sans halo sombre.
  vec3 c = vCouleur * vAlpha * (1.0 - d * 1.4);
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`;

function shader(gl: WebGLRenderingContext, type: number, source: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
  return s;
}

// Fils : des grands cercles inclinés au hasard, légèrement ondulés ; cœur : un amas orange au centre.
function construire(fils: number, parFil: number, coeur: number) {
  const n = fils * parFil + coeur;
  const pos = new Float32Array(n * 3);
  const couleur = new Float32Array(n * 3);
  const taille = new Float32Array(n);
  const lavande = [0.73, 0.65, 1];
  const blanc = [0.98, 0.97, 0.95];
  const orange = [1, 0.48, 0.1];
  let k = 0;
  for (let f = 0; f < fils; f++) {
    // Base orthonormée du plan du fil.
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    const nrm = [Math.sin(b) * Math.cos(a), Math.sin(b) * Math.sin(a), Math.cos(b)];
    const tmp = Math.abs(nrm[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = [nrm[1] * tmp[2] - nrm[2] * tmp[1], nrm[2] * tmp[0] - nrm[0] * tmp[2], nrm[0] * tmp[1] - nrm[1] * tmp[0]];
    const lu = Math.hypot(u[0], u[1], u[2]);
    u[0] /= lu;
    u[1] /= lu;
    u[2] /= lu;
    const v = [nrm[1] * u[2] - nrm[2] * u[1], nrm[2] * u[0] - nrm[0] * u[2], nrm[0] * u[1] - nrm[1] * u[0]];
    const onde = 2 + Math.floor(Math.random() * 4);
    const phase = Math.random() * Math.PI * 2;
    const teinte = Math.random();
    for (let i = 0; i < parFil; i++, k++) {
      const t = (i / parFil) * Math.PI * 2;
      const r = 1 + 0.05 * Math.sin(onde * t + phase);
      const h = 0.06 * Math.sin((onde + 1) * t + phase);
      for (let c = 0; c < 3; c++) {
        pos[k * 3 + c] = r * (Math.cos(t) * u[c] + Math.sin(t) * v[c]) + h * nrm[c];
        couleur[k * 3 + c] = lavande[c] * (1 - teinte) + blanc[c] * teinte;
      }
      taille[k] = 1.4 + Math.random() * 1.2;
    }
  }
  for (let i = 0; i < coeur; i++, k++) {
    const r = 0.32 * Math.cbrt(Math.random());
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    pos[k * 3] = r * Math.sin(b) * Math.cos(a);
    pos[k * 3 + 1] = r * Math.sin(b) * Math.sin(a);
    pos[k * 3 + 2] = r * Math.cos(b);
    for (let c = 0; c < 3; c++) couleur[k * 3 + c] = orange[c];
    taille[k] = 2 + Math.random() * 2.5;
  }
  return { n, pos, couleur, taille };
}

// Renvoie de quoi dessiner (angle en radians), redimensionner et tout libérer ; null sans WebGL.
export function creerPelote(canevas: HTMLCanvasElement, leger: boolean) {
  const gl = canevas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;
  const programme = gl.createProgram()!;
  gl.attachShader(programme, shader(gl, gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(programme, shader(gl, gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(programme);
  gl.useProgram(programme);

  // Téléphone : environ quatre fois moins de particules.
  const { n, pos, couleur, taille } = leger ? construire(16, 260, 300) : construire(30, 560, 1200);
  const tampons: WebGLBuffer[] = [];
  const attribut = (nom: string, donnees: Float32Array, dim: number) => {
    const b = gl.createBuffer()!;
    tampons.push(b);
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, donnees, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(programme, nom);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, dim, gl.FLOAT, false, 0, 0);
  };
  attribut("aPos", pos, 3);
  attribut("aCouleur", couleur, 3);
  attribut("aTaille", taille, 1);
  // Mélange additif : là où les fils se croisent, la lumière s'additionne.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);

  const uRot = gl.getUniformLocation(programme, "uRot");
  const uCanevas = gl.getUniformLocation(programme, "uCanevas");
  const uRayon = gl.getUniformLocation(programme, "uRayon");
  const uDpr = gl.getUniformLocation(programme, "uDpr");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  const redimensionner = () => {
    const r = canevas.getBoundingClientRect();
    canevas.width = Math.round(r.width * dpr);
    canevas.height = Math.round(r.height * dpr);
    gl.viewport(0, 0, canevas.width, canevas.height);
    gl.uniform2f(uCanevas, canevas.width, canevas.height);
    gl.uniform1f(uRayon, Math.min(canevas.width, canevas.height) * 0.27);
    gl.uniform1f(uDpr, dpr);
  };
  redimensionner();

  const dessiner = (angle: number, inclinaison: number) => {
    const cy = Math.cos(angle), sy = Math.sin(angle);
    const cx = Math.cos(inclinaison), sx = Math.sin(inclinaison);
    // Rotation autour de l'axe vertical, puis légère inclinaison (matrice en colonnes).
    gl.uniformMatrix3fv(uRot, false, [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy]);
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
