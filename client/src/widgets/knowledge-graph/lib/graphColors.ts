// Цвета для канваса задаются строками: CSS-переменные в canvas не работают
export type GraphPalette = {
  text: string;
  textDim: string;
  node: string;
  nodeDim: string;
  link: string;
  linkDim: string;
  linkActive: string;
};

export const GRAPH_PALETTES: Record<"dark" | "light", GraphPalette> = {
  dark: {
    text: "#ece9f7",
    textDim: "#6f6b85",
    node: "#8d8aa3",
    nodeDim: "#3a3748",
    link: "rgba(170, 160, 225, 0.38)",
    linkDim: "rgba(170, 160, 225, 0.08)",
    linkActive: "#b9a4ff",
  },
  light: {
    text: "#262238",
    textDim: "#a9a5bd",
    node: "#6f6b85",
    nodeDim: "#d5d2e2",
    link: "rgba(90, 80, 150, 0.35)",
    linkDim: "rgba(90, 80, 150, 0.08)",
    linkActive: "#6d4fd6",
  },
};

const TAG_COLORS = [
  "#a78bfa",
  "#38bdf8",
  "#4ade80",
  "#fbbf24",
  "#f472b6",
  "#fb923c",
] as const;

// Цвет узла зависит от первого тега, чтобы заметки одной темы были одного цвета
export const colorByTag = (tag: string | undefined, fallback: string): string => {
  if (!tag) return fallback;

  let hash = 0;
  for (const char of tag) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;

  return TAG_COLORS[hash % TAG_COLORS.length] ?? fallback;
};
