---
outline: [2,3]
---

# Functions

## Usage

```js
import { <fn> } from '@vrgl/vergil/utilities'
```

## String

<!----------------------------------------------
-------------------- deburr --------------------
----------------------------------------------->
### `deburr`

> Removes diacritics from a string.

```ts
function deburr(str: string): string
```

#### Return value

The given string without diacritics.

#### Examples

```js
deburr('México') // 'Mexico'
```

<!---------------------------------------------
-------------------- prune --------------------
---------------------------------------------->
### `prune`

> Trims, evenly spaces, removes diacritics and lower case a string.

```ts
function prune(str: string): string
```

#### Return value

Lower case, diacritic free, evenly spaced version of `str`

#### Examples

```js
prune(' Verdad  y   Reconciliación   ') // 'verdad y reconciliacion'
```

<!---------------------------------------------------------
-------------------- separateThousands --------------------
---------------------------------------------------------->
### `separateThousands`

> Formats a number string by adding a `separator` string between thousands groups of the number's integer part.

```ts
function separateThousands(num: string | number, separator?: string): string
```

#### Parameters

- **`num`**
- **`separator`** — String to place between thousands groups. Defaults to `','`.

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

```ts
function spaceEvenly(
    str: string,
    separator?: string | ((match: string, ...args: any[]) => string)
): string
```

#### Parameters

- **`str`**
- **`separator`** — String to replace whitespace characters with. Defaults to `' '`.

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

```ts
function ucFirst(str: string): string
```

#### Return value

A copy of `str` with the first character capitalized.

#### Examples

```js
ucFirst('vergil') // 'Vergil'
```

## Object

<!--------------------------------------------------------
-------------------- everyKeyInObject --------------------
--------------------------------------------------------->
### `everyKeyInObject`

> Verifies object keys satisfy required and optional keys specification.

```ts
function everyKeyInObject(
    obj: object,
    keys: string[] | {
        required?: string[];
        optional?: string[];
    },
    strict?: boolean
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

```ts
function isObject(value: unknown): value is Record<PropertyKey, unknown>
```

#### Return value

`true` if `value` is an object, and `false` otherwise.

<!-----------------------------------------------------
-------------------- isPlainObject --------------------
------------------------------------------------------>
### `isPlainObject`

> Assesses whether a value is a plain object.

```ts
function isPlainObject(value: unknown): value is Record<PropertyKey, unknown>
```

#### Return value

`true` if `value` is a plain object, and `false` otherwise.

## Function

<!--------------------------------------------------
-------------------- isFunction --------------------
--------------------------------------------------->
### `isFunction`

> Assesses whether a value is a function.

```ts
function isFunction(value: any): value is Function
```

#### Return value

`true` if `value` is a function, and `false` otherwise.

<!------------------------------------------------
-------------------- debounce --------------------
------------------------------------------------->
### `debounce`

> Creates a debounced function.

```ts
interface Debounced {
    (this: unknown, ...args: unknown[]): void;
    cancel: () => void;
}

function debounce(
    fn: Function,
    minWait: number,
    options?: {
        eager?: boolean;
    }
): Debounced
```

#### Parameters

- **`fn`** — Function to debounce.
- **`minWait`** — Time in milliseconds to wait before executing `fn` since the debounced function's last call.
- `options`
    - **`eager`** — When set to `true`, `fn` is executed as soon as the debounced function is called *if* `fn` is not scheduled and `minWait` milliseconds have elapsed since `fn`'s last execution (or `fn` has not been executed). Defaults to `false`.

#### Return value

Debounced function with `cancel` method to cancel scheduled `fn` execution.

## Descriptor

### `markDescriptor`

> Marks an object as a property descriptor.

```ts
function markDescriptor<T extends object>(value: T): DescriptorMarked<T>
```

#### Parameters

- **`value`** — Object to be marked as a descriptor.

#### Return value

Descriptor-marked object.

### `isDescriptor`

> Assesses whether an object as been marked as a descriptor (with `markDescriptor`).

```ts
function isDescriptor<T>(value: value): value is T extends object
	? DescriptorMarked<T>
	: never
```

#### Return value

`true` if `value` is a descriptor-marked object, and `false` otherwise.

### `dataDescriptor`

> Creates a descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.

```ts
function dataDescriptor(
	value?: unknown,
	writable?: boolean,
	enumerable?: boolean,
	configurable?: boolean
): DescriptorMarked<{
	value: unknown;
	writable?: boolean;
	enumerable?: boolean;
	configurable?: boolean;
}>
```

#### Return value

Descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.

## Theme

### `inferTheme`

```ts
type Theme = 'brand' | 'user' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral'
function inferTheme(theme: string): Theme
```

#### Return value

If `theme` is a [valid theme name or alias](/theme#the-theme-prop), returns the corresponding theme name. Otherwise, returns `'neutral'`.

### `isValidTheme`

> Assesses whether the provided value is a [valid theme name or alias](/theme#the-theme-prop).

```ts
function isValidTheme(value: string): boolean
```

### `isValidRadius`

> Assesses whether the provided value is a [valid theme radius value](/theme#the-radius-prop).

```ts
function isValidRadius(value: string): boolean
```

### `isValidSize`

> Assesses whether the provided value is a [valid theme size value](/theme#the-size-prop).

```ts
function isValidSize(value: string): boolean
```

### `isValidSpacing`

> Assesses whether the provided value is a [valid theme spacing value](/theme#the-spacing-prop).

```ts
function isValidSpacing(value: string): boolean
```