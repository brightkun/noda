Promise — объект, который обещает результат позже: pending → fulfilled или rejected. `then` и `catch` цепляют обработчики, `async/await` это запись того же через код, похожий на синхронный.

```js
async function load(id) {
  try {
    const res = await fetch(`/api/notes/${id}`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

`fetch` не бросает ошибку на 404 или 500, статус надо проверять самому (`res.ok`). Независимые запросы запускают вместе через `Promise.all`, а не по очереди. Обработчики промисов попадают в очередь микрозадач, см. [[Event loop]]. Вместо ручной загрузки в React используют [[React Query]].

Частая ошибка: забыть `await` и получить Promise вместо данных.

#javascript #async #основы
