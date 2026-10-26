import { DatabaseError, PoolClient } from "pg";
import { pool } from "../plugins/pg";
import { apiError } from "../utils/apiError";
import { extractLinkTitles, extractTags } from "../utils/parseNote";
import { withTransaction } from "../utils/withTransaction";
import { NoteInput } from "../schemas/notes.schema";

// type, а не interface: pool.query<T> требует тип с индексной сигнатурой,
// а у interface её нет, и он не пройдёт ограничение T extends QueryResultRow
export type NoteListItem = {
  id: number;
  title: string;
  createdAt: Date;
  tags: string[];
};

type NoteRef = { id: number; title: string };

export type NoteDetails = NoteListItem & {
  body: string;
  links: NoteRef[];
  backlinks: NoteRef[];
};

type SavedNote = { id: number; title: string; body: string };

const isUniqueViolation = (err: unknown): boolean =>
  err instanceof DatabaseError && err.code === "23505";

// Пересобираем все связи заметки: и исходящие ([[ссылки]] в её тексте), и входящие
// (другие заметки могли сослаться на это название раньше, чем заметка появилась,
// или до переименования). Сопоставляем в JS, а не через lower() в SQL:
// так результат не зависит от локали БД и совпадает с парсером.
const syncLinks = async (
  client: PoolClient,
  userId: number,
  note: SavedNote,
) => {
  const { rows: notes } = await client.query<SavedNote>(
    "select id, title, body from notes where user_id = $1",
    [userId],
  );

  const idByTitle = new Map(notes.map((n) => [n.title.toLowerCase(), n.id]));

  const outgoing = new Set<number>();
  for (const title of extractLinkTitles(note.body)) {
    const targetId = idByTitle.get(title);
    if (targetId !== undefined && targetId !== note.id) outgoing.add(targetId);
  }

  const noteTitle = note.title.toLowerCase();
  const incoming = notes
    .filter(
      (n) => n.id !== note.id && extractLinkTitles(n.body).includes(noteTitle),
    )
    .map((n) => n.id);

  await client.query(
    "delete from note_links where from_id = $1 or to_id = $1",
    [note.id],
  );

  if (outgoing.size > 0) {
    await client.query(
      "insert into note_links (from_id, to_id) select $1, unnest($2::int[])",
      [note.id, Array.from(outgoing)],
    );
  }

  if (incoming.length > 0) {
    await client.query(
      "insert into note_links (from_id, to_id) select unnest($1::int[]), $2",
      [incoming, note.id],
    );
  }
};

const syncTags = async (
  client: PoolClient,
  userId: number,
  note: SavedNote,
) => {
  await client.query("delete from note_tags where note_id = $1", [note.id]);

  const names = extractTags(note.body);

  if (names.length === 0) return;

  await client.query(
    `insert into tags (user_id, name) select $1, unnest($2::text[])
     on conflict (user_id, name) do nothing`,
    [userId, names],
  );

  await client.query(
    `insert into note_tags (note_id, tag_id)
     select $1, id from tags where user_id = $2 and name = any($3::text[])`,
    [note.id, userId, names],
  );
};

const saveRelations = async (
  client: PoolClient,
  userId: number,
  note: SavedNote,
) => {
  await syncLinks(client, userId, note);
  await syncTags(client, userId, note);
};

export const listNotes = async (
  userId: number,
  tag?: string,
): Promise<NoteListItem[]> => {
  const { rows } = await pool.query<NoteListItem>(
    `select n.id, n.title, n.created_at as "createdAt",
            coalesce(array_agg(t.name order by t.name) filter (where t.name is not null), '{}') as tags
     from notes n
     left join note_tags nt on nt.note_id = n.id
     left join tags t on t.id = nt.tag_id
     where n.user_id = $1
       and ($2::text is null or exists (
         select 1 from note_tags f
         join tags ft on ft.id = f.tag_id
         where f.note_id = n.id and ft.name = $2
       ))
     group by n.id
     order by n.created_at desc, n.id desc`,
    [userId, tag ?? null],
  );

  return rows;
};

export const getNote = async (
  userId: number,
  id: number,
): Promise<NoteDetails> => {
  const [noteResult, linksResult, backlinksResult] = await Promise.all([
    pool.query<NoteListItem & { body: string }>(
      `select n.id, n.title, n.body, n.created_at as "createdAt",
              coalesce(array_agg(t.name order by t.name) filter (where t.name is not null), '{}') as tags
       from notes n
       left join note_tags nt on nt.note_id = n.id
       left join tags t on t.id = nt.tag_id
       where n.id = $1 and n.user_id = $2
       group by n.id`,
      [id, userId],
    ),
    pool.query<NoteRef>(
      `select n.id, n.title from note_links l
       join notes n on n.id = l.to_id
       where l.from_id = $1 and n.user_id = $2
       order by n.title`,
      [id, userId],
    ),
    pool.query<NoteRef>(
      `select n.id, n.title from note_links l
       join notes n on n.id = l.from_id
       where l.to_id = $1 and n.user_id = $2
       order by n.title`,
      [id, userId],
    ),
  ]);

  const note = noteResult.rows[0];

  if (!note) throw apiError.notFound("Заметка не найдена");

  return { ...note, links: linksResult.rows, backlinks: backlinksResult.rows };
};

export const createNote = async (
  userId: number,
  input: NoteInput,
): Promise<NoteDetails> => {
  try {
    const id = await withTransaction(async (client) => {
      const { rows } = await client.query<SavedNote>(
        `insert into notes (user_id, title, body) values ($1, $2, $3)
         returning id, title, body`,
        [userId, input.title, input.body],
      );
      const note = rows[0];

      if (!note) throw new Error("Заметка не создалась");

      await saveRelations(client, userId, note);
      return note.id;
    });

    return getNote(userId, id);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw apiError.conflict("Заметка с таким названием уже есть");
    }
    throw err;
  }
};

export const updateNote = async (
  userId: number,
  id: number,
  input: NoteInput,
): Promise<NoteDetails> => {
  try {
    await withTransaction(async (client) => {
      const { rows } = await client.query<SavedNote>(
        `update notes set title = $3, body = $4
         where id = $1 and user_id = $2
         returning id, title, body`,
        [id, userId, input.title, input.body],
      );
      const note = rows[0];

      if (!note) throw apiError.notFound("Заметка не найдена");

      await saveRelations(client, userId, note);
    });

    return getNote(userId, id);
  } catch (err) {
    if (isUniqueViolation(err)) {
      throw apiError.conflict("Заметка с таким названием уже есть");
    }
    throw err;
  }
};

export const deleteNote = async (userId: number, id: number) => {
  const { rowCount } = await pool.query(
    "delete from notes where id = $1 and user_id = $2",
    [id, userId],
  );

  if (!rowCount) throw apiError.notFound("Заметка не найдена");
};
