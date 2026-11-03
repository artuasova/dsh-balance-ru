# Баланс и расходы (₽) для DeepSeek Harness

[![CI](https://github.com/artuasova/dsh-balance-ru/actions/workflows/ci.yml/badge.svg)](https://github.com/artuasova/dsh-balance-ru/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/artuasova/dsh-balance-ru?label=release)](https://github.com/artuasova/dsh-balance-ru/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Неофициальный русский форк плагина
[`@pipilu123566/dsh-balance`](https://github.com/pipilu123566/deepseek-harness-plugin):
балансы провайдеров и расходы за день в боковой панели DeepSeek Harness, с пересчётом
всех сумм в рубли по курсу ЦБ РФ и русским интерфейсом.

- Репозиторий: <https://github.com/artuasova/dsh-balance-ru>
- Готовый архив: [`dsh-balance-ru-1.2.0.tgz`](../../releases/download/v1.2.0/dsh-balance-ru-1.2.0.tgz)
  (все версии — [Releases](../../releases))

## Скриншоты

![Обзор: баланс и расходы за сегодня с пересчётом в рубли](docs/images/balance-panel.png)

*Обзор панели: доступный баланс и расходы за сегодня. Строки `≈ 237 ₽` и `≈ 153 ₽` —
приблизительный пересчёт по курсу ЦБ, исходные суммы остаются в USD и CNY.*

![Цены моделей](docs/images/prices-panel.png)

*«Цены моделей»: свои цены за миллион токенов для пары «поставщик/модель», с валютой
CNY или USD.*

Скриншоты сделаны в рабочей установке DeepSeek Harness 0.2.1-rc.5; суммы — фактические
остатки на момент снимка.

## Возможности

- **Балансы провайдеров**: аккаунт DeepSeek, официальный DeepSeek API, OpenRouter,
  SiliconFlow и другие провайдеры с документированным endpoint баланса. Несколько
  моделей одного провайдера делят одну строку баланса.
- **Рубли**: рядом с каждой суммой — приблизительный пересчёт `≈ 295 ₽` по курсу ЦБ РФ
  (USD и CNY). Это только отображение: суммы не конвертируются в данные и не
  складываются между валютами.
- **Расходы за сегодня**: сумма, разбивка по моделям и по сессиям, расход за каждый ход
  в чате. Оценка строится по записанному расходу токенов и ценам моделей.
- **Цены моделей**: свои цены за вход, выход, чтение и создание кэша для пары
  «поставщик/модель»; сохранение пересчитывает исторические оценки.
- **Честные статусы**: нет ключа, нет прав на баланс, лимит запросов, неизвестная цена,
  неотправленный расход — показываются явно, а не как нулевой баланс.
- **Русский интерфейс встроен**: плагин добавляет язык «Русский» и свой словарь,
  отдельный языковой пакет не нужен.

## Требования

- DeepSeek Harness **0.2.1-rc.5** (Desktop); версия проверяется полем `engines.dsh`.
- Windows, macOS или Linux — плагин клиентский, работает в Web UI Harness.
- Интернет для курса ЦБ (кэш 6 часов). Без сети суммы показываются как обычно, без ₽.

## Установка

1. Полностью закройте DeepSeek Harness (не просто сверните окно).
2. Скачайте [`dsh-balance-ru-1.2.0.tgz`](../../releases/download/v1.2.0/dsh-balance-ru-1.2.0.tgz).
3. Если раньше стоял оригинальный `@pipilu123566/dsh-balance`, удалите его — в профиле
   должен остаться только один плагин баланса:

   ```sh
   dsh plugin --profile desktop remove @pipilu123566/dsh-balance
   ```

4. Установите архив:

   ```sh
   dsh plugin --profile desktop add ./dsh-balance-ru-1.2.0.tgz --ignore-scripts
   ```

   Если `dsh` не в `PATH` (macOS):

   ```sh
   '/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh' \
     plugin --profile desktop add ./dsh-balance-ru-1.2.0.tgz --ignore-scripts
   ```

   Windows: `"%LOCALAPPDATA%\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd"`
   `plugin --profile desktop add .\dsh-balance-ru-1.2.0.tgz --ignore-scripts`.

5. Откройте Harness: внизу боковой панели появится кнопка **«Баланс»**. Наведите курсор
   или нажмите, чтобы закрепить панель; `Esc` закрывает.

Для разработки плагин можно поставить из папки (ссылка на checkout вместо копии):

```sh
dsh plugin --profile desktop add "/полный/путь/к/dsh-balance-ru" --ignore-scripts
```

## Русский язык

Плагин сам добавляет язык «Русский» (fallback `en`) и свой словарь на 86 строк.
Переключение: **Настройки → Общие → Язык → Русский**. Переводится интерфейс этого
плагина; остальной Harness останется на английском, если языковой пакет не установлен.
Недостающие ключи всегда берутся из английского словаря, поэтому интерфейс не ломается.

## Как считается рубль

- Источник: [`cbr-xml-daily.ru`](https://www.cbr-xml-daily.ru/) — дневные курсы ЦБ РФ,
  CORS разрешён. Резервный источник: `https://open.er-api.com/v6/latest/USD`.
- Запрос выполняет браузер; кэш — 6 часов. Балансы и расходы по-прежнему приходят только
  от штатных сервисов Harness, курс к ним не применяется.
- Значение приблизительное (`≈`): до копеек при сумме меньше 100 ₽, до рублей — от 100 ₽.
  Подсказка при наведении на `₽` показывает дату курса.

## Отличия от `@pipilu123566/dsh-balance@1.1.0`

| | Апстрим 1.1.0 | Этот форк 1.2.0 |
|---|---|---|
| Рубли по курсу ЦБ | — | ✅ панель, расходы, модели, сессии, ход |
| Русский словарь | — | ✅ 86 строк, встроен |
| Язык `ru` | — | ✅ регистрируется плагином |
| Поставка | `@pipilu123566/dsh-balance` | `dsh-balance-ru` |
| Id слотов | `pipilu-balance` | `dsh-balance-ru`, `dsh-balance-ru-turn` |
| Метаданные RU/EN/ZH | en, zh | ✅ ru, en, zh |
| Тесты | 29 | ✅ 30, включая `rub.test.js` |

Внутренние имена апстрима сохранены: сервис `pipiluBalance`, проекция
`pipiluTokenUsage`, namespace словаря `pipilu.balance`. Логика балансов, расхода и цен
(`index.js`, `balances.js`, `usage.js`, `pricing.js`) не изменялась.

## Разработка и тесты

```sh
npm install
npm test        # 30 тестов: балансы, usage, цены, клиент, RUB
npm pack        # dsh-balance-ru-1.2.0.tgz
```

CI (`.github/workflows/ci.yml`) запускает `npm test` на Node 22 при каждом push.

Структура:

```
index.js            хост-сервис: балансы, расход, цены (Remote API)
balances.js         запросы балансов провайдеров и разбор ответов
usage.js            подсчёт расхода токенов и цен
pricing.js          валидация цен
client.js           клиентская половина: панель, RU-словарь, пересчёт в ₽
cordis.patch.yml    вставка плагина в профиль
locale/{ru,en,zh}.json  карточка плагина для страницы «Плагины»
rub.test.js         тесты словаря и рублёвого пересчёта
```

## Лицензия и авторство

MIT. Оригинал — [`@pipilu123566/dsh-balance`](https://github.com/pipilu123566/deepseek-harness-plugin)
(pipilu123566), см. [`LICENSE`](LICENSE) и [`NOTICE.md`](NOTICE.md).

Это неофициальный форк, не связанный с DeepSeek и с автором апстрима. Иконка унаследована
от оригинального пакета (MIT).
