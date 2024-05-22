---
outline: [2,3]
---

# Get Started

## Installation

1. [Authenticate to GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages)

2. In the same directory as the project's `package.json` file, create or edit an `.npmrc` file to include a line specifying GitHub Packages URL and the namespace where the package is hosted:

```cmd
@8ctavio:registry = https://npm.pkg.github.com
```

3. Install dependency:

```cmd
pnpm add @8ctavio/vergil
```
:::tip
See [Installing a Package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)
:::

## Styles

Vergil has its own styles sheet that style custom components and the user interface overall look. To import Vergil's styles to the project being worked on, add the following at the beginning of the project's main css file.

```css
@import '@8ctavio/vergil/styles/main.css';
```

The theme defined in the imported css file defaults to Vergil's color theme. To customize theme, overwrite [existing css variables](https://github.com/8ctavio/vergil/blob/main/packages/core/styles/main.css).

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
@import url('https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10;0,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

:root{
    /* Overwrite css variables */
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```