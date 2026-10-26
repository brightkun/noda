import "../config/env";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "../plugins/pg";
import { DEMO_USER_ID } from "../config/demo";
import { createNote, updateNote } from "../services/notes.service";

const SEED_DIR = join(__dirname, "../../../seed-notes");

const run = async () => {
  // password_hash — заглушка, не валидный хеш: войти этим пользователем нельзя
  await pool.query(
    `insert into users (id, email, password_hash)
     values ($1, 'demo@noda.local', '!')
     on conflict (id) do nothing`,
    [DEMO_USER_ID],
  );
  await pool.query(
    "select setval(pg_get_serial_sequence('users', 'id'), greatest((select max(id) from users), 1))",
  );

  const files = readdirSync(SEED_DIR).filter((file) => file.endsWith(".md"));

  // Порядок не важен: входящие связи пересчитываются при сохранении каждой заметки
  for (const file of files) {
    const title = file.replace(/\.md$/, "");
    const body = readFileSync(join(SEED_DIR, file), "utf-8");

    const { rows } = await pool.query<{ id: number }>(
      "select id from notes where user_id = $1 and title = $2",
      [DEMO_USER_ID, title],
    );
    const existing = rows[0];

    if (existing) {
      await updateNote(DEMO_USER_ID, existing.id, { title, body });
    } else {
      await createNote(DEMO_USER_ID, { title, body });
    }
  }

  console.log(`Сид: ${files.length} заметок`);
  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
