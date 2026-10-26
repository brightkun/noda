import { NoteRef } from "../model/types";

// split с группой возвращает куски кода на нечётных местах: их не трогаем
const CODE_RE = /(```[\s\S]*?```|`[^`\n]*`)/g;
const LINK_RE = /\[\[([^\]]+)\]\]/g;

export const MISSING_LINK_HREF = "#missing";

// Превращает [[Название]] в обычную markdown-ссылку, чтобы react-markdown
// не нужен был плагин. Ссылки на несуществующие заметки получают #missing.
export const renderWikiLinks = (body: string, links: NoteRef[]): string => {
  const idByTitle = new Map(
    links.map((link) => [link.title.toLowerCase(), link.id]),
  );

  return body
    .split(CODE_RE)
    .map((part, index) => {
      if (index % 2 === 1) return part;

      return part.replace(LINK_RE, (_match, raw: string) => {
        const title = raw.trim();
        const id = idByTitle.get(title.toLowerCase());

        return id === undefined
          ? `[${title}](${MISSING_LINK_HREF})`
          : `[${title}](/notes/${id})`;
      });
    })
    .join("");
};
