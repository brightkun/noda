import "../config/env";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pool } from "../plugins/pg";

const run = async () => {
  const sql = readFileSync(join(__dirname, "../../db/schema.sql"), "utf-8");

  await pool.query(sql);
  console.log("Схема применена");
  await pool.end();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
