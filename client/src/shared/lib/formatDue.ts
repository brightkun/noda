const DAY_MS = 24 * 60 * 60 * 1000;

const pluralDays = (days: number): string => {
  const lastTwo = days % 100;
  const last = days % 10;

  if (lastTwo >= 11 && lastTwo <= 14) return "дней";
  if (last === 1) return "день";
  if (last >= 2 && last <= 4) return "дня";
  return "дней";
};

// «через 3 дня» для даты следующего повторения
export const formatDueIn = (iso: string): string => {
  const days = Math.max(1, Math.round((new Date(iso).getTime() - Date.now()) / DAY_MS));

  return `через ${days} ${pluralDays(days)}`;
};
