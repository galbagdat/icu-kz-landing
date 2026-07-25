/**
 * Приёмник результатов теста «Карта сильных сторон» → Google-таблица.
 *
 * КАК ПОДКЛЮЧИТЬ (делается один раз, ~5 минут):
 *  1. Создайте новую Google-таблицу (sheets.new).
 *  2. В меню: Расширения → Apps Script.
 *  3. Удалите то, что там есть, и вставьте весь этот файл. Сохраните (Ctrl/Cmd+S).
 *  4. Нажмите «Развернуть» (Deploy) → «Новое развёртывание» (New deployment).
 *     - Тип (шестерёнка) → «Веб-приложение» (Web app).
 *     - «Запуск от имени» (Execute as): Я / Me.
 *     - «У кого есть доступ» (Who has access): Все / Anyone.
 *     - Нажмите «Развернуть», разрешите доступ к своему аккаунту.
 *  5. Скопируйте «URL веб-приложения» (заканчивается на /exec).
 *  6. Пришлите этот URL — его вставят в SUBMIT_URL в career/index.html,
 *     после чего результаты начнут падать строками в лист «Ответы».
 *
 *  Данные хранятся ТОЛЬКО в вашей таблице и вашем Google-аккаунте.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Ответы') || ss.insertSheet('Ответы');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата', 'Имя', 'Класс', 'Топ-суперсилы', 'Стиль (DISC)', 'Роль в команде',
        'Интересы (RIASEC)', 'Профессии', 'Страны',
        'Сигнал тревоги (0-100)', 'Самостоятельность (0-100)', 'Все ответы (JSON)'
      ]);
      sheet.setFrozenRows(1);
    }

    var d = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      d.name || '',
      d.klass || '',
      (d.strengths || []).join(', '),
      d.disc || '',
      d.role || '',
      (d.riasec || []).join(', '),
      (d.professions || []).join(' | '),
      (d.countries || []).join(', '),
      d.anxiety,
      d.diff,
      JSON.stringify(d.answers || {})
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Проверка, что скрипт жив (открыть URL в браузере — увидите "OK"). */
function doGet() {
  return ContentService.createTextOutput('OK: приёмник результатов работает.');
}
