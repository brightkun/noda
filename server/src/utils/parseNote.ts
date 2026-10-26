const LINK_RE = /\[\[([^\]]+)\]\]/g;
// тег начинается с буквы и стоит после пробела/начала строки: "# Заголовок" и "#1" не считаются
const TAG_RE = /(?:^|\s)#(\p{L}[\p{L}\p{N}_-]*)/gu;

// ссылки и теги внутри кода — это примеры, а не настоящие связи
const stripCode = (body: string): string =>
  body.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

const unique = (values: string[]): string[] => Array.from(new Set(values));

// Названия в нижнем регистре: заметки сопоставляются без учёта регистра, как в Obsidian
export const extractLinkTitles = (body: string): string[] => {
  const titles = Array.from(
    stripCode(body).matchAll(LINK_RE),
    (match) => (match[1] ?? "").trim().toLowerCase(),
  );

  return unique(titles.filter(Boolean));
};

export const extractTags = (body: string): string[] => {
  const tags = Array.from(stripCode(body).matchAll(TAG_RE), (match) =>
    (match[1] ?? "").toLowerCase(),
  );

  return unique(tags.filter(Boolean));
};
