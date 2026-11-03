import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

// Browser-level behaviour of the fork additions: the bundled Russian dictionary
// and the ruble approximation. React itself is replaced by a small recorder.
const SOURCE = readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const CBR = {
  Date: '2026-11-03T11:30:00+03:00',
  Valute: { USD: { Nominal: 1, Value: 80.9734 }, CNY: { Nominal: 1, Value: 12.1714 } },
};

function load({ fetchImpl } = {}) {
  let module, dictionaries = {}, registered = {};
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => typeof type === 'function'
      ? type({ ...props, children })
      : { type, props: props || {}, children },
  };
  runInNewContext(SOURCE, {
    window: { __ModuleLoader__: { load: value => { module = value; } } },
    fetch: fetchImpl,
    console: { error: () => {} },
  });
  module.factory(name => { assert.equal(name, 'react'); return React; }).apply({
    locale: {
      addLanguage: value => { dictionaries.language = value; return () => {}; },
      register: (namespace, values, dict) => { return () => {}; },
    },
    slots: { inject: (_name, callback) => callback(), register: (options, component) => { registered[options.name] = { options, component }; } },
  });
  return { dictionaries, registered };
}

function dictionaries() {
  let module, dicts = {};
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => typeof type === 'function' ? type({ ...props, children }) : { type, props: props || {}, children },
  };
  runInNewContext(SOURCE, { window: { __ModuleLoader__: { load: value => { module = value; } } }, console: { error: () => {} } });
  module.factory(name => { assert.equal(name, 'react'); return React; }).apply({
    locale: {
      addLanguage: () => () => {},
      register: (namespace, values, dict) => {
        if (typeof values === 'string') dicts[values] = dict;
        else dicts[namespace] = values;
        return () => {};
      },
    },
    slots: { inject: () => {}, register: () => {} },
  });
  return dicts;
}

const textOf = value => Array.isArray(value)
  ? value.map(textOf).join('')
  : value && typeof value === 'object'
    ? value.type === 'style' ? '' : textOf(value.children)
    : value === false || value == null ? '' : String(value);

const usage = {
  tokens: 1000, input: 500, cacheRead: 0, cacheWrite: 0, output: 500,
  calls: 1, missing: 0, unpriced: 0, costs: { CNY: '761000000', USD: '364000000' }, groups: {},
};

function turnView(options) {
  const { registered } = load(options);
  return t => textOf(registered['conversation.chat.turnTail'].component({
    turn: { turn: 0 },
    useProjection: () => ({ turns: { 0: usage } }),
    t,
  }));
}

test('the plugin carries a complete Russian dictionary and registers the ru language', () => {
  const dicts = dictionaries();
  const base = dicts['pipilu.balance'];
  assert.ok(base.zh && base.en, 'built-in dictionaries');
  assert.ok(dicts.ru, 'Russian dictionary');
  const missing = Object.keys(base.en).filter(key => dicts.ru[key] === undefined);
  const extra = Object.keys(dicts.ru).filter(key => base.en[key] === undefined);
  assert.deepEqual({ missing, extra }, { missing: [], extra: [] });
  assert.equal(dicts.ru.title, 'Баланс и расходы');
  assert.ok(dicts.ru.rubHint, 'rubHint is translated');
});

test('ruble approximation follows the CBR feed and stays approximate', async () => {
  const render = turnView({ fetchImpl: async () => ({ ok: true, json: async () => CBR }) });
  const before = render(key => key);
  assert.ok(!before.includes('₽'), 'no rubles before the rate is loaded');
  await new Promise(resolve => setImmediate(resolve));
  const after = render(key => key);
  assert.ok(after.includes('CNY 7.61 ≈ 92,62 ₽'), after);
  assert.ok(after.includes('USD 3.64 ≈ 295 ₽'), after);
});

test('a failed rate request degrades to no ruble line instead of an error', async () => {
  const render = turnView({ fetchImpl: async () => { throw new Error('offline'); } });
  await new Promise(resolve => setImmediate(resolve));
  const view = render(key => key);
  assert.ok(!view.includes('₽'), view);
  assert.ok(view.includes('CNY 7.61'));
});

test('a page without a working fetch shows the original amounts only', async () => {
  const render = turnView({ fetchImpl: undefined });
  const view = render(key => key);
  assert.ok(!view.includes('₽'), view);
  assert.ok(view.includes('USD 3.64'));
});
