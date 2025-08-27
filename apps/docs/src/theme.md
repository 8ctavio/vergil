---
outline: [2,3]
---

<script setup>
import { Icon } from '@8ctavio/vergil/components'
</script>

<style module>
.icon {
    display: inline-block;
    padding: 0 5px;
    font-size: 1.2em;
    color: var(--c-moss-1);
}
</style>

# Theme

Vergil's theme defines global styles and css variables to maintain a consistent looking design throughout the application. This theme should be imported at the beginning of the main css file of the project being worked on as shown below.

```css
@import '@8ctavio/vergil/styles'
```

To customize the theme, [existing css variables](https://github.com/8ctavio/vergil/blob/main/packages/core/styles/main.css) may be overwritten.

Additionally, Vergil components are designed to be themed with different colors. Vergil defines different *themes* for components to change the color palette with which they are styled. Component themes are specified through a `theme` prop.

Similarly, component's geometric appearance may be customized though `size`, `radius`, and `spacing` props.

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

Vergil provides several [color palettes](https://github.com/8ctavio/vergil/tree/main/packages/core/styles/colors) that can be assigned to `theme`s. Available color palettes are: `grey`, `emerald`, `dartmouth`, `moss`, `teal`, `sky`, `denim`, `cobalt`, `indigo`, `wine`, `red`, and `yellow`.

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

:::tip
The `@8ctavio/vergil/styles` stylesheet imports the `grey` color. Therefore, it should not be required to import `@8ctavio/vergil/colors/grey` to use `grey` color variables inside the custom theme stylesheet.
:::

The stylesheet contains a declaration block for each `theme`. Each declaration block sets `theme`-specific variables with color palette-specific variables. This is how a color palette is assigned to a `theme`.

Therefore, to change a `theme`'s color palette, simply rename the color palette-specific variables to include the desired color palette name:

```css
--c-theme-solid-1: var(--c-moss-1); /* [!code --] */
--c-theme-solid-1: var(--c-<color>-1); /* [!code ++] */
```

### User theme

The special `'user'` `theme` value allows to style components with a user-selected color palette. Every other `theme` is static in the sense that their color palette cannot be modified during runtime. Conversely, Vergil provides an `userThemeColor` ref to update the color palette `'user'` themed components are styled with.

```js
import { userThemeColor } from '@8ctavio/vergil/utilities/userTheme'
```

Only available color palette names may be assigned to `userThemeColor`. The developer must ensure used color palettes are properly imported.

:::tip
Click on the <Icon code="style" :class="$style.icon"/> icon in the navigation bar to update the user theme color palette.
:::

#### [Configuration options](/configuration)

- **Disable user theme**. User theme is enabled by default. If for the project being developed is not desired to use the user theme, it can be disabled by setting the `userTheme.enable` configuration option to `false`.
- **Default theme**. By default, the user theme is set to `'moss'`. This can be overwritten through the `userTheme.default` configuration option.

| `userTheme.<option>` | type | default |
| -------------------- | ---- | ------- |
| `enable` | `boolean` | `true` |
| `default` | `ColorPalette` | `'moss'` |

### `ColorPicker` component

Vergil provides a `ColorPicker` component for the user to conveniently update the user-theme color palette.

#### Usage

```vue
<script setup>
import { ColorPicker } from '@8ctavio/vergil/utilities/userTheme'
</script>

<template>
    <ColorPicker/>
</template>
```

<Demo>
    <ColorPicker/>
</Demo>

#### Props

<br>

##### Colors <Badge><pre>colors: ColorPalette[] | Partial<Record<ColorPalette, string>></pre></Badge>

As an array, `colors` should contain [color palette names](#color-palettes). Custom labels can be provided by passing an object instead, where keys are color palette names and values the corresponding display labels.

##### Position <Badge><pre>position: 'absolute' | 'fixed'</pre></Badge>

`ColorPicker`'s popover CSS `position` property.

:::tip
If a `ColorPicker`'s parent has position `fixed`, use `position: 'fixed'`.
:::

## Geometric appearance

Most Vergil components accept `size`, `radius`, and `spacing` props to customize their appearance by updating geometric attributes such as `font-size`, `border-radius`, and `padding`.

### The `size` prop

The `size` prop adjusts the size of components' font (`font-size`) and gaps (`padding`, `margin`, `gap`).

Possible `size` values are shown below.

```ts
type size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

### The `radius` prop

The `radius` prop adjusts components' `border-radius`.

Possible `radius` values are shown below.

```ts
type radius = 'none' | 'sm' | 'md' | 'lg' | 'full'
```

### The `spacing` prop

The `spacing` prop increases or decreases the size of components' gaps (`padding`, `margin`, `gap`) without updating the font size with in order to give either a more compact or spacious look.

Possible `spacing` values are shown below.

```ts
type spacing = '' | 'compact' | 'expanded'
```

## The `descendant` prop

Components that support the `theme`, `size`, `radius`, and `spacing` props also support a boolean `descendant` prop. When set, this prop marks the component as a descendant of another component that also accept the beforementioned props. The default value of descendant component's theme-related props will not be set, allowing them to inherit a parent component's prop values.

## Global style props default values

Default values for the `theme`, `size`, `radius`, and `spacing` props can be globally defined for components that support them under the `global` [configuration option](/configuration).

Default global values for these props are shown below.

| prop | default global value |
| ---- | -------------------- |
| `theme` | `'brand'` |
| `size` | `'md'` |
| `radius` | `'md'` |
| `spacing` | `''` |