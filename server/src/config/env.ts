try {
  process.loadEnvFile();
} catch {
  // Файла .env нет — переменные берутся из окружения
}

export const requireEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Переменная окружения ${name} не задана (см. .env.example)`);
  }

  return value;
};
