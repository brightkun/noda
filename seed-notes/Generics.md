Generic — это параметр типа: функция или тип работает с разными типами, не теряя информацию о них.

```ts
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2, 3]); // number | undefined
const s = first(["a", "b"]); // string | undefined
```

Ограничение через `extends`:

```ts
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

Встроенные generic-типы, которые ты уже используешь: `Array<T>`, `Promise<T>`, `Partial<T>`, `Pick<T, K>`, `Record<K, V>`.

Связано с [[TypeScript типы]]. В React generics встречаются в `useState<User | null>(null)` ([[React hooks]]) и `useQuery<Note[]>` ([[React Query]]).

Частая ошибка: писать `any` вместо `T`, из-за чего тип результата теряется.

#typescript #generics
