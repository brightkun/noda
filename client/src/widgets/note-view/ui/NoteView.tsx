"use client";

import Link from "next/link";
import { useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { MISSING_LINK_HREF, renderWikiLinks } from "@/entities/note";
import type { Note } from "@/entities/note";

// [[ссылки]] уже превращены в обычные markdown-ссылки (renderWikiLinks),
// здесь только решаем, чем их рисовать
const components: Components = {
  a: ({ href, children }) => {
    if (href === MISSING_LINK_HREF) {
      return (
        <span className="wikilink-missing" title="Заметки с таким названием ещё нет">
          {children}
        </span>
      );
    }

    if (href?.startsWith("/notes/")) {
      return <Link href={href}>{children}</Link>;
    }

    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },
};

export const NoteView = ({ note }: { note: Note }) => {
  const markdown = useMemo(
    () => renderWikiLinks(note.body, note.links),
    [note.body, note.links],
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="note-prose">
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
      </div>

      <section aria-labelledby="backlinks-title" className="border-t pt-6">
        <h2 id="backlinks-title" className="mb-3 text-sm font-medium text-muted-foreground">
          Упоминается в
        </h2>
        {note.backlinks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Пока ни одна заметка не ссылается на эту.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {note.backlinks.map((backlink) => (
              <li key={backlink.id}>
                <Link
                  href={`/notes/${backlink.id}`}
                  className="inline-flex h-8 items-center rounded-md border px-3 text-sm transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {backlink.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
