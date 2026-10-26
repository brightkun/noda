React Query (TanStack Query) управляет серверным состоянием: загрузка, кэш, повторные запросы, статусы.

```tsx
const { data, isPending, error } = useQuery<Note[]>({
  queryKey: ["notes"],
  queryFn: () => fetch("/api/notes").then((r) => r.json()),
});
```

- `queryKey`: ключ кэша. Другой ключ значит другой кэш, массив может включать параметры: `["note", id]`
- `useMutation`: для POST/PUT/DELETE. После успеха делают `queryClient.invalidateQueries({ queryKey: ["notes"] })`
- `staleTime`: сколько данные считаются свежими

Серверное состояние (данные из API) держи в React Query, клиентское (открыта ли панель) в `useState` или Zustand. Без этого [[React hooks]] с `useEffect` превращаются в ручной кэш.

Запросы асинхронны, см. [[Event loop]]. Тип ответа задаётся generic-параметром, см. [[Generics]]. На странице Next.js, которая рендерится на сервере, см. [[Next.js рендеринг]].

Частая ошибка: класть данные запроса в `useState` и синхронизировать вручную.

#react #react-query
