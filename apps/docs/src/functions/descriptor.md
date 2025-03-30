---
outline: [2,3]
---

# Descriptor

## Usage

```js
import { <fn> } from '@8ctavio/vergil'
```

## `markDescriptor`

> Marks an object as a property descriptor.

```js
function markDescriptor(value: object): object
```

#### Parameters

- **`value`** — Object to be marked as a descriptor.

#### Return value

Descriptor-marked object.

## `isDescriptor`

> Assesses whether an object as been marked as a descriptor (with `markDescriptor`).

```js
function isDescriptor(value: any): boolean
```

#### Return value

`true` if `value` is a descriptor-marked object, and `false` otherwise.

## `dataDescriptor`

> Creates a descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.

```js
function dataDescriptor(value?: any, writable?: boolean, enumerable?: boolean, configurable?: boolean): object
```

#### Return value

Descriptor-marked object with `value`, `writable`, `enumerable`, and `configurable` properties.