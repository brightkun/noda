# Пустая папка нужна для FSD

Next.js принимает `src/pages` за Pages Router. Пустая `pages/` в корне заставляет его игнорировать `src/pages`, где лежит слой FSD `pages`.
