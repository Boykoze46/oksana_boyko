# Сайт Оксаны Бойко

Статический сайт (HTML + CSS + JavaScript) без фреймворков.

```
index.html          — разметка и тексты
css/style.css       — стили
js/script.js        — меню, WhatsApp-ссылки, галереи, просмотр фото
assets/oksana/      — фото Оксаны и её работы (works/)
assets/manicure/    — курс «Маникюр с нуля» (work-* — работы, grad-* — выпускницы)
assets/pedicure/    — курс «PRO педикюр»
assets/perezagruzka/— курс «Перезагрузка» (process-*, result-*, grad-*)
```

Каждое фото хранится в одном экземпляре (до 1280 px по длинной стороне) — и для страницы, и для полноэкранного просмотра.

## Публикация на GitHub Pages
1. Загрузите содержимое этой папки в корень репозитория.
2. Settings → Pages → Source: ветка `main`, папка `/ (root)`.

## Сертификаты Оксаны
Положите фото в `assets/certificates/` и перечислите их в массиве `CERTIFICATES` в начале `js/script.js`.

## WhatsApp
Номер и текст сообщений задаются в начале `js/script.js` (`WHATSAPP_NUMBER`, `COURSE_MESSAGE_PREFIX`).
Название курса берётся из атрибута `data-course` у кнопки.
