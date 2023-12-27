---
outline: [2,3]
---

# Get Started

## Installation

Currently, to use Vergil its repository must be added as a submodule to a monorepo. Then, with pnpm's workspace feature, Vergil can be regarded and used as a package inside the monorepo.

## Styles

Vergil has its own styles sheet that style custom components and the user interface overall look. To import Vergil's styles to the project being worked on, add the following at the beginning of the project's main css file.

```css
@import 'vergil/assets/main.css';
```

The theme defined in the imported css file defaults to Vergil's color theme. To customize theme, overwrite [existing css variables](https://github.com/8ctavio/vergil/blob/main/packages/core/assets/main.css).

:::tip
Use Vergil's css variables to style the underlying project Vergil is being used on.
:::

### Icons

Vergil uses [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols) to display icons in components. In order for icons to display properly, it is required to import Material Symbols as follows

```css
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@1");
```

Icon codes required by Vergil components are the ones used by Material Symbols.

### Fonts

In order to avoid importing fonts that may ultimately not be used, Vergil's font-family css variables value is `initial`. Thus, these variables should always be overwritten with fonts of choice. An example of this is shown next.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');

:root{
    /* Overwrite css variables */
    --font-main: 'Inter', sans-serif;
}
```