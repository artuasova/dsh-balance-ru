# Notice and attribution

This repository is an unofficial fork of **`@pipilu123566/dsh-balance` 1.1.0** —
<https://github.com/pipilu123566/deepseek-harness-plugin> — distributed under the MIT
License. The original copyright notice is retained in `LICENSE`:

    Copyright (c) 2026 pipilu123566

The MIT license permits modification and redistribution provided that the copyright
notice and permission notice are included; `LICENSE` is kept unchanged and this file
documents what changed.

## Changes made by this fork

- Ruble approximation (`≈ 295 ₽`) next to provider balances, today's spending, per-model
  and per-session amounts, and per-turn costs, using the CBR daily rate with a fallback
  feed. The conversion is display-only; original amounts and currencies are untouched.
- Bundled Russian dictionary (86 strings) and registration of the `ru` language row.
- Distribution renamed: package `dsh-balance-ru`, plugin id `dsh-balance-ru`, slot ids
  `dsh-balance-ru` and `dsh-balance-ru-turn`. Internal service and projection names
  (`pipiluBalance`, `pipiluTokenUsage`, locale namespace `pipilu.balance`) are inherited
  from upstream.
- Locale registration made resilient to client hot reload, so a failed dictionary
  registration cannot remove the sidebar slots.
- Display metadata localized for Russian, English and Chinese; added `rub.test.js`.

## Trademarks

"DeepSeek" and the DeepSeek Harness name belong to their owners. This fork is not
affiliated with, endorsed by, or supported by DeepSeek or by the upstream plugin author.
