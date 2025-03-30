---
outline: [2,3]
---

# Functions

## Usage

```js
import { <fn> } from '@8ctavio/vergil/utilities'
```

## String

<!----------------------------------------------
-------------------- deburr --------------------
----------------------------------------------->
### `deburr`

> Removes diacritics from a string.

```js
function deburr(str: string): string
```

#### Return value

The given string without diacritics.

#### Examples

```js
deburr('México') // 'Mexico'
```

<!---------------------------------------------------
-------------------- formatWords --------------------
---------------------------------------------------->
### `formatWords`

> Formats a string by applying a `formatter` function to its words and joins them with a `separator` string. A **word** is considered as a sequence of alphanumerical characters (including diacritics).

```js
function formatWords(str: string, formatter: function, separator: string = ' '): string
```

#### Parameters

- **`str`**
- **`formatter`** — Formatter function to apply to every word.
- **`separator`** — String to join formatted words with.

#### Return value

Formatted string.

<!-------------------------------------------------
-------------------- kebabCase --------------------
-------------------------------------------------->
### `kebabCase`

> Converts a string to kebab case. Only alphanumeric characters are considered. Diacritics are removed.

```js
function kebabCase(str: string): string
```

#### Return value

Kebab cased string.

#### Examples

```js
kebabCase('El Cartógrafo Silencioso') // 'el-cartografo-silencioso'
```

<!---------------------------------------------------------
-------------------- separateThousands --------------------
---------------------------------------------------------->
### `separateThousands`

> Formats a number string by adding a `separator` string between thousands groups of the number's integer part.

```js
function separateThousands(num: string | number, separator: string = ','): string
```

#### Parameters

- **`num`**
- **`separator`** — String to place between thousands groups.

#### Return value

Thousands separated number string.

#### Examples

```js
separateThousands(123456789) // '123,456,789'
```

<!---------------------------------------------------
-------------------- spaceEvenly --------------------
---------------------------------------------------->
### `spaceEvenly`

> Trims a string and replaces consecutive white space characters (`/\s+/`) with a single space character (`" "`) or a custom separator string.

```js
function spaceEvenly(str: string, separator: string = ' '): string
```

#### Parameters

- **`str`**
- **`separator`** — String to replace whitespace characters with.

#### Return value

Evenly spaced (separated) string.

#### Examples

```js
spaceEvenly('  Guilty    Spark     ') // 'Guilty Spark'
spaceEvenly(' 123   456  789  ', '-') // '123-456-789'
```

<!-----------------------------------------------
-------------------- ucFirst --------------------
------------------------------------------------>
### `ucFirst`

> Capitalizes first character of a string.

```js
function ucFirst(str: string): string
```

#### Return value

The given string with its first character capitalized.

#### Examples

```js
ucFirst('vergil') // 'Vergil'
```

<!---------------------------------------------
-------------------- words --------------------
---------------------------------------------->
### `words`

> Splits a string into an array of its words. A **word** is considered as a sequence of alphanumerical characters (including diacritics).

```js
function words(str: string): string[]
```

#### Return value

Array of words.

#### Examples

```js
words("A Day At The Beach") // ["A", "Day", "At", "The", "Beach"]
```

## Object

<!--------------------------------------------------------
-------------------- everyKeyInObject --------------------
--------------------------------------------------------->
### `everyKeyInObject`

> Verifies object keys satisfy required and optional keys specification.

```js
function everyKeyInObject(
    obj: object,
    keys: string[] | {
        required?: string[];
        optional?: string[];
    },
    strict?: boolean = true
): boolean
```

#### Parameters

- **`obj`** — Object to perform key verification on.
- **`keys`** — Expected `required` and `optional` keys to be present in the object. Optional keys verification is only performed for `strict = true`. As an array, `keys` represents the required keys only.
- **`strict`** — Whether non-required keys are allowed. If optional keys are specified, object's non-required keys must be `optional` keys. Defaults to `true`.

#### Return value

- `if(optional.length && strict)`: Whether all required keys are a subset of object keys and all object's non-required keys are a subset of optional keys.
- `else if(strict)`: Whether all required keys are are equal to the object keys.
- `else`: Whether all required keys are a subset of object keys.

#### Examples

```js
everyKeyInObject({ foo: '' }, ['foo'])                   // true
everyKeyInObject({ foo: '', bar: '' }, ['foo'])          // false
everyKeyInObject({ foo: '', bar: '' }, ['foo'], false)   // true

everyKeyInObject({ foo: '', bar: '', baz: '' }, {   
    required: ['foo'],
    optional: ['bar']
}) // false
everyKeyInObject({ foo: '', bar: '', baz: '' }, {   
    required: ['foo'],
    optional: ['bar', 'baz']
}) // true
everyKeyInObject({ bar: '' }, {                     
    optional: ['foo', 'bar', 'baz']
}) // true
```

<!------------------------------------------------
-------------------- isObject --------------------
------------------------------------------------->
### `isObject`

> Assesses whether a value is an object.

```js
function isObject(value: any): boolean
```

#### Return value

`true` if `value` is an object.

<!-----------------------------------------------------
-------------------- isPlainObject --------------------
------------------------------------------------------>
### `isPlainObject`

> Assesses whether a value is a plain object.

```js
function isPlainObject(value: any): boolean
```

#### Return value

`true` if `value` is a plain object.

## Function

<!--------------------------------------------------
-------------------- isFunction --------------------
--------------------------------------------------->
### `isFunction`

> Assesses whether a value is a function.

```js
function isFunction(value: any): boolean
```

#### Return value

`true` if `value` is a function.

<!------------------------------------------------
-------------------- debounce --------------------
------------------------------------------------->
### `debounce`

> Creates a debounced function.

```js
function debounce(
    fn: function,
    minWait: number,
    options?: {
        eager?: boolean;
    }
): function
```

#### Parameters

- **`fn`** — Function to debounce.
- **`minWait`** — Time in milliseconds to wait before executing `fn` since the debounced function's last call.
- `options`
    - **`eager`** — When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.

#### Return value

Debounced function with `cancel` method to cancel scheduled `fn` execution.

## Date

<!----------------------------------------------------
-------------------- getTimestamp --------------------
----------------------------------------------------->
### `getTimestamp`

> Offset a timestamp and/or convert its time unit.

```js
function getTimestamp({
    from: number = Date.now(),
    unit: 'ms' | 's' = 'ms',
    offset: {
        s: number;
        m: number;
        h: number;
        d: number;
    } = {}
}): number
```

#### Parameters

- **`from`** — Reference timestamp in milliseconds to get new timestamp from.
- **`unit`** —Time unit to convert reference timestamp to.
- **`s`** — Offset seconds from reference timestamp.
- **`m`** — Offset minutes from reference timestamp.
- **`h`** — Offset hours from reference timestamp.
- **`d`** — Offset days (24 h) from reference timestamp.

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

<!---------------------------------------------------
-------------------- getDayStart --------------------
---------------------------------------------------->
### `getDayStart`

> Gets a start of day timestamp (00:00:00.000) of another timestamps' date in a given timezone.

```js
function getDayStart(tzo: number, timestamp: number = Date.now()): number
```

#### Parameters

- **`tzo`** — Timezone offset in minutes.
- **`timestamp`** — Reference timestamp in milliseconds.

#### Return value

Start-of-day timestamp of the target-timezone-date with the provided timestamp.

## Reactivity

<!-----------------------------------------------------
-------------------- isWatchSource --------------------
------------------------------------------------------>
### `isWatchSource`

> Assesses whether a value is a valid watch source.

```js
function isWatchSource(value: any): boolean
```

#### Return value

`true` if `value` is a valid watch source.

## Theme

### `inferTheme`

```js
function inferTheme(theme: string): string
```

#### Return value

If `theme` is a [valid theme name or alias](/theme#the-theme-prop), returns the corresponding theme name. Otherwise, returns `'neutral'`.

### `isValidTheme`

> Assesses whether the provided value is a [valid theme name or alias](/theme#the-theme-prop).

```js
function isValidTheme(value: any): boolean
```

### `isValidRadius`

> Assesses whether the provided value is a [valid theme radius value](/theme#the-radius-prop).

```js
function isValidRadius(value: any): boolean
```

### `isValidSize`

> Assesses whether the provided value is a [valid theme size value](/theme#the-size-prop).

```js
function isValidSize(value: any): boolean
```

### `isValidSpacing`

> Assesses whether the provided value is a [valid theme spacing value](/theme#the-spacing-prop).

```js
function isValidSpacing(value: any): boolean
```