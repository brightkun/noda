import { pool } from "../plugins/pg";
import { listNotes } from "./notes.service";

type GraphLink = { source: number; target: number };

// Формат под react-force-graph: { nodes, links }
export const getGraph = async (userId: number, tag?: string) => {
  const notes = await listNotes(userId, tag);
  const nodeIds = new Set(notes.map((note) => note.id));

  const { rows } = await pool.query<GraphLink>(
    `select l.from_id as source, l.to_id as target
     from note_links l
     join notes a on a.id = l.from_id
     join notes b on b.id = l.to_id
     where a.user_id = $1 and b.user_id = $1`,
    [userId],
  );

  return {
    nodes: notes.map(({ id, title, tags }) => ({ id, title, tags })),
    // при фильтре по тегу оставляем только связи между оставшимися узлами
    links: rows.filter(
      (link) => nodeIds.has(link.source) && nodeIds.has(link.target),
    ),
  };
};
