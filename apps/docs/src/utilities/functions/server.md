---
outline: [2,3]
---

# Server Functions

## Usage

```js
import { <fn> } from '@8ctavio/vergil/server'
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