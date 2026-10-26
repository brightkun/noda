TypeScript проверяет типы только при компиляции, в рантайме их нет. Тип описывает форму значения, а не создаёт его.

Основное:
- примитивы: `string`, `number`, `boolean`, `null`, `undefined`
- объекты: `type User = { id: number; name: string }` или `interface`
- объединение: `type Id = string | number`
- литералы: `type Dir = "left" | "right"`
- `unknown` безопаснее `any`: перед использованием нужно сузить тип (`typeof`, `in`, `instanceof`)

```ts
function show(v: string | number) {
  if (typeof v === "string") return v.toUpperCase(); // здесь v: string
  return v.toFixed(2); // здесь v: number
}
```

`type` и `interface` почти взаимозаменяемы для объектов. `interface` расширяется через `extends`, `type` умеет объединения и пересечения.

Дальше: [[Generics]] для переиспользуемых типов. Данные с сервера проверяй в рантайме, типы сами этого не делают (zod).

Частая ошибка: считать, что тип защищает от неверного JSON с сервера.

#typescript #основы
