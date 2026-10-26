В Next.js (App Router) компонент по умолчанию серверный (Server Component): он рендерится на сервере, его код не попадает в браузер.

- Server Component: может читать БД и API напрямую, `async`/`await`, без хуков
- Client Component: файл начинается с `"use client"`, тут работают [[React hooks]], события, браузерные API
- SSG: страница собирается один раз при билде
- SSR: страница рендерится на каждый запрос (динамические данные)
- ISR: статика с периодическим обновлением (`revalidate`)

```tsx
// app/notes/page.tsx — серверный
export default async function Page() {
  const notes = await fetch("http://localhost:4000/notes").then((r) => r.json());
  return <NotesList notes={notes} />;
}
```

Интерактивные части выноси в маленькие клиентские компоненты, остальное оставляй серверным. Для данных на клиенте с кэшем используют [[React Query]].

Структуру кода по слоям описывает [[FSD]]: в Next папка `app/` для роутов, а слои FSD живут рядом в `src/`.

Частая ошибка: ставить `"use client"` на всю страницу, потому что один блок использует `useState`.

#nextjs #rendering
