---
outline: [2,3]
---

<script setup>
import { Icon } from '@8ctavio/vergil/components'
</script>

# Theme

Vergil's theme defines global styles and css variables to maintain a consistent looking design throughout the application. This theme should be imported at the beginning of the main css file of the project being worked on as shown below.

```css
@import '@8ctavio/vergil/styles'
```

To customize the theme, [existing css variables](https://github.com/8ctavio/vergil/blob/main/packages/core/styles/main.css) may be overwritten.

:::tip
Use Vergil's css variables to style the underlying project Vergil is being used on.
:::

Additionally, Vergil components are designed to be themed with different colors. Vergil defines different *themes* for components to change the color palette with which they are styled. Component themes are specified through a `theme` prop.

## The `theme` prop

Most Vergil components can be styled with different color palettes through a `theme` prop. Different component themes help transmit severity or scope of interactions with components.

Possible `theme` values along with available aliases are summarized in the following table.

| `theme` | Aliases |
| ------- | ------- |
| `'brand'` | none |
| `'user'` | none |
| `'ok'` | `'success', 'check'` |
| `'info'` | `'help', 'tip'` |
| `'warn'` | `'warning', 'caution'` |
| `'danger'` | `'error'` |
| `'neutral'` | none |

Every `theme` should have a color palette assigned.

### Color palettes

Vergil provides several [color palettes](https://github.com/8ctavio/vergil/tree/main/packages/core/styles/colors) that can be assigned to `theme`s. Available color palettes are listed next:

- `grey`
- `dartmouth`
- `moss`
- `teal`
- `sky`
- `denim`
- `cobalt`
- `indigo`
- `wine`
- `red`
- `yellow`

A color palette may be imported as shown below.

```css
@import '@8ctavio/vergil/colors/<color>'
```

### Default `theme` colors

Vergil's default `theme` colors are shown in the following table.

| `theme` | Default color palette |
| ------- | ------- |
| `'brand'` | `moss` |
| `'ok'` | `dartmouth` |
| `'info'` | `cobalt` |
| `'warn'` | `yellow` |
| `'danger'` | `red` |
| `'neutral'` | `grey` |

These default colors may be imported in the following way.

```css
@import '@8ctavio/vergil/colors/default'
```

### Custom `theme` colors

In order to customize `theme`s' color palettes, it's recommended to edit a copy of Vergil's [default colors stylesheet](https://github.com/8ctavio/vergil/blob/main/packages/core/styles/default.css).

At the start of the file, only required color palettes should be imported.

The stylesheet contains a declaration block for each `theme`. Each declaration block sets `theme` specific variables with a color palette specific variable. This is how a color palette is assigned to a `theme`.

Therefore, to change a `theme`'s color palette, simply rename the color palette specific variables to include the desired color palette name:

```diff
- --c-theme-1: var(--c-moss-1);
+ --c-theme-1: var(--c-<color>-1);
```

### User theme

The special `'user'` `theme` value allows to style components with a user-selected color palette. Every other `theme` is static in the sense that their color palette cannot be modified during runtime. Conversely, Vergil provides an API to programmatically update the color palette `'user'` themed components are styled with.

#### Plugin

First, the `userTheme` plugin should be installed.


```js
import { createApp } from 'vue'
import { userTheme } from '@8ctavio/vergil/userTheme'

const app = createApp()

app.use(userTheme)
```

By default, selected `'user'` `theme` color palette is the same as the `'brand'` `theme` color palette.


#### API

Vergil provides a `setUserThemeColor` function and `userThemeColor` ref to handle updating `'user'` theme color palette.

```ts
type color = 'cobalt' | 'dartmouth' | 'denim' | 'grey' | 'indigo' | 'moss' | 'red' | 'sky' | 'teal' | 'wine' | 'yellow'

function setUserThemeColor(color: color): void

const userThemeColor: Ref<color | 'brand'>
```

The `setUserThemeColor` function updates the user theme color palette. It only accepts available color palette names. The developer must ensure used color palettes are properly imported.

The `userThemeColor` ref contains the current user theme color palette. It is possible for its value to be `'brand'`, in which case, the color palette used for `'user'` themed components is the same as the `'brand'` `theme` color palette.

:::tip

Click on the <Icon code="style"/> icon in the navigation bar to update the user theme color palette.

:::

<style scoped>
.icon{
    display: inline-block;
    padding: 0 5px;
    font-size: 1.2em;
    color: var(--c-moss-1);
}
</style>