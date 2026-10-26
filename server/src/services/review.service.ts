import { pool } from "../plugins/pg";

export type ReviewCard = {
  id: number;
  noteId: number;
  noteTitle: string;
  question: string;
  dueAt: Date;
};

// answer не отдаём: ответ ученика оценивает AI по тексту заметки
export const getTodayCards = async (userId: number): Promise<ReviewCard[]> => {
  const { rows } = await pool.query<ReviewCard>(
    `select c.id, c.note_id as "noteId", n.title as "noteTitle",
            c.question, c.due_at as "dueAt"
     from cards c
     join notes n on n.id = c.note_id
     where c.user_id = $1 and c.due_at <= now()
     order by c.due_at`,
    [userId],
  );

  return rows;
};
