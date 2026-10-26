import { pool } from "../plugins/pg";

export type TagItem = { name: string; notesCount: number };

export const listTags = async (userId: number): Promise<TagItem[]> => {
  const { rows } = await pool.query<TagItem>(
    `select t.name, count(*)::int as "notesCount"
     from tags t
     join note_tags nt on nt.tag_id = t.id
     where t.user_id = $1
     group by t.id
     order by t.name`,
    [userId],
  );

  return rows;
};
