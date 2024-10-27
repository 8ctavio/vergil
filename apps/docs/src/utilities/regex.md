---
outline: [2,3]
---

# Regex

## Usage

```js
import { <re> } from '@8ctavio/vergil/utilities/regex'
```

Some regular expressions have two versions: `re<Pattern>` and `reNot<Pattern>`:

- `re-`. Designed to test if an entire string matches the pattern.
- `reNot-`. Designed to test if a substring does not match the pattern.

Consider, for example, the `reDigits` and `reNotDigit` regular expressions.

```js
reDigits.test('123456')  // true
reDigits.test('123abc')  // false

reNotDigit.test('123456')  // false
reNotDigit.test('123abc')  // true
```

`reDigits` test passes if the string only contains digits. `reNotDigit` test passes if there's a non-digit character in the string.

### `re[Not]Alphabetic`

> Pattern for alphabetic (including diacritics) and white space characters.

#### Examples

```js
reAlphabetic.test('The Ark')             // true
reNotAlphabetic.test('Installation 00')  // true
```

### `re[Not]Alphanumeric`

> Pattern for alphanumeric (including diacritics) and white space characters.

#### Examples

```js
reAlphanumeric.test('Vue v3')    // true
reNotAlphanumeric.test('vue@3')  // true
```

### `reDigits` and `reNotDigit`

> Pattern for digits.

#### Examples

```js
reDigits.test('117')     // true
reNotDigit.test('S117')  // true
```

### `reEmail`

> Pattern for emails.

#### Examples

```js
reEmail.test('master.chief@vergil.unsc')  // true
```

### `reNumber`

> Pattern for numbers.

#### Examples

```js
reNumber.test('343')     // true
reNumber.test('3.1416')  // true
reNumber.test('-0.8')    // true
reNumber.test('100e6')   // true
```

### `re[Not]Numeric`

> Pattern for numeric and white space characters.

#### Examples

```js
reNumeric.test('8.0.0')      // true
reNotNumeric.test('v0.0.8')  // true
```

### `re[Not]Sentence`

> Pattern for alphanumeric (including diacritics), white space and punctuation characters.

#### Examples

```js
reSentence.test('The quick brown fox jumps over the lazy dog.')  // true
```