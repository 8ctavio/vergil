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
deburr('México')  // 'Mexico'
```

<!---------------------------------------------------
-------------------- formatPhone --------------------
---------------------------------------------------->
### `formatPhone`

> Formats numeric string as a 10-digit phone number.

```js
function formatPhone(phone: string): string
```

#### Return value

10-digit phone number formatted string.

#### Examples

```js
formatPhone('1234567890')  // '123 456 7890'
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
kebabCase('El Cartógrafo Silencioso')  // 'el-cartografo-silencioso'
```

<!----------------------------------------------------
-------------------- sentenceCase --------------------
----------------------------------------------------->
### `sentenceCase`

> Converts a string to sentence case. Only alphanumeric characters (including diacritics) are considered.

```js
function sentenceCase(str: string): string
```

#### Return value

Sentece cased string.

#### Examples

```js
sentenceCase('Assault on the Control Room')  // 'Assault on the control room'
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
separateThousands(123456789)  // '123,456,789'
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
- **`separator`** — String to replace white space characters with.

#### Return value

Evenly spaced (separated) string.

#### Examples

```js
spaceEvenly('  Jane    Doe     ')        // 'Jane Doe'
spaceEvenly(' 123   456  789  ', '-')    // '123-456-789'
```

<!-------------------------------------------------
-------------------- startCase --------------------
-------------------------------------------------->
### `startCase`

> Converts a string to start case. Only alphanumeric characters (including diacritics) are considered.

```js
function startCase(str: string): string
```

#### Return value

Start cased string.

#### Examples

```js
startCase('high charity')  // 'High Charity'
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
ucFirst('vergil')  // 'Vergil'
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
words('Zacatecas, Zacatecas, México')  // ['Zacatecas', 'Zacatecas', 'México]
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
- **`required`** —  Expected `required` and `optional` keys to be present in the object. Optional keys verification is only performed for `strict = true`. As an array, `keys` represents the required keys only.
- **`strict`** — Whether non-required keys are allowed. If optional keys are specified, object's non-required keys must be `optional` keys. Defaults to `true`.

#### Return value

- `if(optional.length && strict)`: Whether all required keys are a subset of object keys and all object's non-required keys are a subset of optional keys.
- `else if(strict)`: Whether all required keys are a subset of object keys.
- `else`: Whether all required keys are are equal to the object keys.

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

## Error

<!------------------------------------------------
-------------------- AppError --------------------
------------------------------------------------->
### `AppError`

> Class to manage custom app (front-end) errors.

```ts
class AppError {
    type: string
    message: string | {
        title: string;
        details: string;
    }
    code: string
    details: object

    constructor({
        type: string,
        log: string,
        message: string | {
            title: string;
            details: string;
        },
        code: string = '',
        details: object
    })
}
```

#### Parameters

- **`type`** — Developer defined `AppError` type.
- **`code`** — Developer defined code. There may be different set of codes for different `type` values.
- **`details`** — `type` specific error details.
- **`log`** — Message to be logged in the console.
- **`message`** — User friendly message. As an object, `message` is separated in a `title` and `details`.

<!---------------------------------------------------
-------------------- ServerError --------------------
---------------------------------------------------->
### `ServerError`

> Server specific (back-end) error.

```ts
class ServerError{
    message: string
    operation: string
    code: string
    causes?: (string | Error)[]

    constructor (options: ServerError)
}
```

#### Parameters

- **`message`** — Human readable error description
- **`operation`** — Name of operation where error originated.
- **`code`** — A firebase functions' [FunctionsErrorCode](https://firebase.google.com/docs/reference/node/firebase.functions#functionserrorcode).
- **`cause`** — Deductively ordered error causes.

## Reactivity

<!-----------------------------------------------------
-------------------- isWatchSource --------------------
------------------------------------------------------>
### `isWatchSource`

> Assesses whether a value is a valid watch source.

```js
function isWatchSource(mayBeWatchSource: any): boolean
```

#### Return value

`true` if `mayBeWatchSource` is a valid watch source.