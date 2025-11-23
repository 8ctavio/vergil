---
outline: [2,3]
---

# Configuration

Vergil provides an API to configure the properties, behavior, or functionality of some resources (i.e., components, features, etc.). A resource may be configured by overwriting its own configuration options, if any.

## Overwrite configuration options

An `options` object may be provided to the `vergil` plugin to individually overwrite resources' configuration options. Each root-level `options` property represents a resource's configuration and must be an object including the options to overwrite with their corresponding values.

:::tip
The documentation of configurable resources include available configuration options along with their default values, and the resource's root property name under which it may be configured through `vergil` plugin's `options` object.
:::

```js
import { createApp } from 'vue'
import { vergil } from '@vrgl/vergil/plugins'

const app = createApp()

// Overwrite default configuration options
app.use(vergil, {
    [resource]: {
        [option]: value
    }
})
```

## Global configuration options

Global configuration options allow for their values to be shared across corresponding resource-specific configuration options. A resource may override a global configuration option by overwriting its own matching configuration option.

Global configuration options may be overwritten under the `global` root-level configuration property.

| `global.<option>` | type | default |
| ----------------- | ---- | ------- |
| `validationDelay` | `number` | `300` |
| `validationCooldown` | `number` | `350` |
| `theme` | [`theme`](/theme#the-theme-prop) | `'brand'` |
| `size` | [`size`](/theme#the-size-prop) | `'md'` |
| `radius` | [`radius`](/theme#the-radius-prop) | `'md'` |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | `''` |
| `icon.brand` | `string` | `'verified'` |
| `icon.user` | `string` | `'verified'` |
| `icon.ok` | `string` | `'check_circle'` |
| `icon.info` | `string` | `'info'` |
| `icon.warn` | `string` | `'warning'` |
| `icon.danger` | `string` | `'cancel'` |
| `icon.neutral` | `string` | `'info'` |