---
outline: [2,3]
head:
  - - meta
    - name: algolia-site-verification
      content: A80C8E10BDBB2BC9
---

# Get Started

The following sections outline how to integrate Vergil into a Vite-powered Vue project.

## Installation

```shell
pnpm add @vrgl/vergil
```

## Vite configuration

The Vergil package should be excluded from Vite's dependency pre-bundling.

```ts
// vite.config.js
export default defineConfig({
    optimizeDeps: {
        exclude: ['@vrgl/vergil']
    }
})
```

## Vue plugin

Vergil provides a `vergil` plugin that should always be installed to properly enable or initialize some features. 

```js {3,7}
import App from './path-to/App.vue'
import { createApp } from 'vue'
import { vergil } from '@vrgl/vergil/plugins'

const app = createApp(App)

app.use(vergil)
```

The plugin also allows to override Vergil's default configuration. To learn more about Vergil's configuration see the [Configuration](/configuration.md) section.

## Root component

An application using Vergil should be wrapped with the [`Vergil`](/components/vergil) component to globally enable the use of some components. In particular, `Vergil` enables popovers; other components may be enabled through props.

```vue
<script setup>
import { Vergil } from '@vrgl/vergil/components'
</script>

<template>
    <Vergil>
        <AppLayout/>
    </Vergil>
</template>
```

## Styles

To import Vergil's default theme in the project being worked on, add the following lines at the beginning of the project's main css file.

```css
@import '@vrgl/vergil/styles';
@import '@vrgl/vergil/colors/default';
```

For more information about Vergil's theme see the [Theme](/theme.md) section.

### Icons

Vergil uses [Material Symbols](https://fonts.google.com/icons?icon.style=Rounded&icon.set=Material+Symbols) to display icons in components. In order for icons to display properly, it is required to import Material Symbols as follows

```css
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@1");
```

Icon codes required by Vergil components are the ones used by Material Symbols.

### Fonts

In order to avoid importing fonts that may ultimately not be used, Vergil's font-family css variables value is `initial`. Thus, these variables should always be overwritten with fonts of choice. An example of this is shown next.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

:root {
    /* Overwrite css variables */
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```