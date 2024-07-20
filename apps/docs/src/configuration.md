---
outline: [2,3]
---

# Configuration

> Vergil configuration defines default options and behavior for some features and components.

Throughout this documentation, each feature or component section points out the relevant configuration options. See [Default configuration](/configuration.md#default-configuration) for an overview of all configuration options.

## Overwrite configuration

To overwrite Vergil's default configuration, pass an `options` object to the `vergil` plugin. The `options` object should be of the form of the default configuration object.

```js
import { createApp } from 'vue'
import { vergil } from '@8ctavio/vergil/plugins'

const app = createApp()

const options = { /* custom options */ }

app.use(vergil, options)
```

## Global configuration

Some features and components share default configuration option values that are defined under the `global` root-level configuration option.

For features or components configured through global options there are corresponding feature/component-specific configuration options to overwrite the global options.

## Default configuration

```ts
type color = 'cobalt' | 'dartmouth' | 'denim' | 'grey' | 'indigo' | 'moss' | 'red' | 'sky' | 'teal' | 'wine' | 'yellow'
type radius = 'none' | 'sm' | 'md' | 'lg'
type size = 'sm' | 'md' | 'lg' | 'xl'
type spacing = '' | 'compact' | 'expanded'
type theme = 'brand' | 'user' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral'
type toastPosition = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end'

interface VergilConfiguration {
    global: {
        theme: theme = 'brand';
        size: size = 'md';
        radius: radius = 'md';
        spacing: spacing = '';
        icon: {
            brand: string = 'verified';
            user: string = 'verified';
            ok: string = 'check_circle';
            info: string = 'info';
            warn: string = 'warning';
            danger: string = 'cancel';
            neutral: string = 'info';
        } 
    },
    userTheme: {
        enable: boolean = true;
        default: color = 'moss';
    },
    btn: {
        variant: ('solid' | 'soft' | 'ghost' | 'outline' | 'underline' | 'text') = 'solid';
        fill: boolean;
        borderless: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
        squared: boolean;
    },
    btn3D: {
        variant: ('solid' | 'soft' | 'plain') = 'solid';
        bordered: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
        squared: boolean;
    },
    confirm: {
        confirmLabel: string = 'Accept';
        declineLabel: string = 'Cancel';
        icon: {
            brand: string;
            user: string;
            ok: string;
            info: string;
            warn: string;
            danger: string;
            neutral: string;
        }
    },
    popup: {
        theme: theme;
    },
    toast: {
        theme: theme;
        icon: {
            brand: string;
            user: string;
            ok: string;
            info: string;
            warn: string;
            danger: string;
            neutral: string;
        }
    },
    toaster: {
        positions: toastPosition[] = ['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'];
        default: toastPosition = 'bottom-end';
        duration: number = 6;
    }
}
```