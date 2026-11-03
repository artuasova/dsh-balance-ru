# Balance and spending (RUB) for DeepSeek Harness

Unofficial fork of [`@pipilu123566/dsh-balance`](https://github.com/pipilu123566/deepseek-harness-plugin)
that adds a ruble approximation at the CBR (Bank of Russia) daily rate and a bundled
Russian UI dictionary.

## Features

- Provider balances (DeepSeek account, official DeepSeek API, OpenRouter, SiliconFlow, …).
- Today's spending with model and session breakdowns and per-turn costs.
- `≈ 295 ₽` next to every amount, converted from USD/CNY at the CBR daily rate.
  Display only: amounts keep their original currency and are never summed across currencies.
- Configurable per-model input/output/cache prices.
- Explicit errors, missing credentials and unpriced calls instead of fake zeros.
- Bundled Russian dictionary; no separate language pack required.

## Requirements

- DeepSeek Harness **0.2.1-rc.5** (Desktop).
- Internet access for the exchange rate (cached for 6 hours; without it no ruble line is shown).

## Install

1. Fully quit DeepSeek Harness.
2. Download `dsh-balance-ru-1.2.0.tgz` from the Releases page (or build it: `npm install && npm pack`).
3. Remove the original plugin unless you keep only one balance plugin in the profile:
   `dsh plugin --profile desktop remove @pipilu123566/dsh-balance`
4. Add the tarball:
   `dsh plugin --profile desktop add ./dsh-balance-ru-1.2.0.tgz --ignore-scripts`
5. Start Harness and use the **Balance** button at the bottom of the sidebar.

Switch the plugin UI to Russian with **Settings → General → Language → Russian**
(the plugin registers the `ru` language itself; other DSH strings follow the installed
language pack, falling back to English).

## Exchange rate

- `https://www.cbr-xml-daily.ru/daily_json.js` (CORS-enabled CBR mirror), fallback
  `https://open.er-api.com/v6/latest/USD`.
- Cached 6 hours; the rate is approximate (`≈`) and the tooltip shows the rate date.
- The browser fetches the rate; balance and usage data still come only from DSH services.

## Build and test

```sh
npm install
npm test   # 30 tests
npm pack   # dsh-balance-ru-1.2.0.tgz
```

## Differences from upstream 1.1.0

Ruble approximation, bundled Russian dictionary and `ru` language registration, renamed
distribution (`dsh-balance-ru`, slot ids `dsh-balance-ru` / `dsh-balance-ru-turn`), hot-reload
resilience for locale registration, localized display metadata, new `rub.test.js`.
Internal service names (`pipiluBalance`, `pipiluTokenUsage`, locale namespace `pipilu.balance`)
are kept from upstream.

## License

MIT. Original work Copyright (c) 2026 pipilu123566 — see `LICENSE` and `NOTICE.md`.
Unofficial fork, not affiliated with DeepSeek.
