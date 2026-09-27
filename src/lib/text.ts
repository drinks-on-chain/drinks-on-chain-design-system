// Utilidades de texto para búsquedas en cliente (Combobox, CommandPalette).

/** Minúsculas y sin tildes: "Bodéga Ñandú" → "bodega nandu". */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

/** Todas las palabras de `query` aparecen en alguno de los textos (sin tildes ni mayúsculas). */
export function matchesQuery(query: string, ...texts: (string | undefined)[]): boolean {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeText(texts.filter(Boolean).join(" "));
  return words.every((word) => haystack.includes(word));
}
