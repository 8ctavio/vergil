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

```ts
function markDescriptor<T extends object>(value: T): DescriptorMarked<T>
```

#### Parameters

- **`value`** — Object to be marked as a descriptor.

#### Return value

Descriptor-marked object.

## `isDescriptor`

> Assesses whether an object as been marked as a descriptor (with `markDescriptor`).

```ts
function isDescriptor<T>(value: value): value is T extends object
	? DescriptorMarked<T>
	: never
```

#### Return value

`true` if `value` is a descriptor-marked object, and `false` otherwise.

## `dataDescriptor`

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