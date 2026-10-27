// État partagé entre la page (qui mesure le défilement) et la scène 3D (qui le lit à chaque image).
// Un simple objet, pour ne pas redessiner React à chaque pixel de défilement.
// progres : 0 = gamelle, 1 = fontaine, 2 = litière, 3 = arbre à chat (valeurs intermédiaires pendant le passage).
export const etatScene = { progres: 0 };
