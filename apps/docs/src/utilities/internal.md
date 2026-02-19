---
outline: [2,3]
---

# Functions

## Usage

```js
import { <fn> } from '@vrgl/vergil/internal/utilities'
```

## String

<!---------------------------------------------------
-------------------- formatWords --------------------
---------------------------------------------------->
### `formatWords`

> Formats a string by applying a `formatter` function to its words and joins them with a `separator` string. A **word** is considered as a sequence of alphanumerical characters (including diacritics).

```ts
function formatWords(
    str: string,
    formatter: (word: string, idx: number) => string,
    separator?: string
): string
```

#### Parameters

- **`str`**
- **`formatter`** — Formatter function to apply to every word.
- **`separator`** — String to join formatted words with. Defaults to `" "`.

#### Return value

Formatted string.

<!-------------------------------------------------
-------------------- kebabCase --------------------
-------------------------------------------------->
### `kebabCase`

> Converts a string to kebab case. Only alphanumeric characters are considered. Diacritics are removed.

```ts
function kebabCase(str: string): string
```

#### Return value

Kebab cased string.

#### Examples

```js
kebabCase('El Cartógrafo Silencioso') // 'el-cartografo-silencioso'
```

<!---------------------------------------------
-------------------- words --------------------
---------------------------------------------->
### `words`

> Splits a string into an array of its words. A **word** is considered as a sequence of alphanumerical characters (including diacritics).

```ts
function words(str: string): string[]
```

#### Return value

Array of words.

#### Examples

```js
words("A Day At The Beach") // ["A", "Day", "At", "The", "Beach"]
```

## Date

<!----------------------------------------------------
-------------------- getTimestamp --------------------
----------------------------------------------------->
### `getTimestamp`

> Offset a timestamp and/or convert its time unit.

```ts
function getTimestamp(options?: {
    from?: number;
    unit?: 'ms' | 's';
    offset?: {
        s?: number;
        m?: number;
        h?: number;
        d?: number;
    }
}): number
```

#### Parameters

- **`from`** — Reference timestamp in milliseconds to get new timestamp from. Defaults to `Date.now()`.
- **`unit`** — Time unit to convert reference timestamp to. Defaults to `'ms'`.
- **`offset`** — Offset specification. Defaults to `{}`.
    - **`s`** — Offset seconds from reference timestamp. Defaults to `0`.
    - **`m`** — Offset minutes from reference timestamp. Defaults to `0`.
    - **`h`** — Offset hours from reference timestamp. Defaults to `0`.
    - **`d`** — Offset days (24 h) from reference timestamp. Defaults to `0`.

#### Return value

Offset and unit converted timestamp.

#### Examples

```js
/*
The returned timestamp is in seconds and is of 5 days before
today at 2 hours, 5 minutes, 30 seconds from now's time
*/
getTimestamp({
    from: Date.now(),
    units: 's',
    offset: {
        s: 30,
        m: 5,
        h: 2,
        d: -5
    }
})
```

## Reactivity

<!-----------------------------------------------------
-------------------- isWatchSource --------------------
------------------------------------------------------>
### `isWatchSource`

> Assesses whether a value is a valid watch source.

```ts
function isWatchSource<T>(value: MaybeRefOrGetter<T>): value is WatchSource<T>
```

#### Return value

`true` if `value` is a valid watch source, and `false` otherwise.