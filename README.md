# Карта школ Астаны

Главная страница открывает интерактивную карту OpenStreetMap с двумя слоями из QGIS Server: `schools_points` и `schools_polygons`.

## Структура

- `public/index.html`, `public/styles.css`, `public/app.js` — карта в браузере.
- `lighttpd.conf` — отдаёт главную страницу из `/app/public`, а запросы `/qgis` передаёт QGIS Server.
- `Week_11_Variant_3.qgz` и `schools_astana.gpkg` — проект и данные, лежат рядом в `/app`.

Пути источников в проекте: `./schools_astana.gpkg|layername=schools_points` и `./schools_astana.gpkg|layername=schools_polygons`.

## Render

Используйте существующий Web Service с Docker и веткой `main`. Dockerfile остаётся в корне репозитория. Сервер слушает `0.0.0.0:10000`; Docker Command можно оставить пустым, чтобы использовался CMD из Dockerfile. Если Docker Command уже содержит запуск lighttpd с `/etc/lighttpd/lighttpd.conf`, он также подходит.

После изменения кода дождитесь автоматического развёртывания. Если оно выключено: **Manual Deploy → Deploy latest commit**. Дополнительный Static Site создавать не нужно.

Карта: https://qgis-server-schools.onrender.com/

Проверка WMS: https://qgis-server-schools.onrender.com/qgis?MAP=/app/Week_11_Variant_3.qgz&SERVICE=WMS&REQUEST=GetCapabilities

Для подложки и библиотеки Leaflet браузеру нужен доступ к `tile.openstreetmap.org` и `unpkg.com`.
