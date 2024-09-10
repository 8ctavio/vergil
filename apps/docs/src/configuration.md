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
type color = 'cobalt' | 'dartmouth' | 'denim' | 'emerald' | 'grey' | 'indigo' | 'moss' | 'red' | 'sky' | 'teal' | 'wine' | 'yellow'
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
    badge: {
        variant: ('soft' | 'outline' | 'solid') = 'soft';
        [variant]: {
            outline: (boolean | 'subtle' | 'regular' | 'strong');
        };
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
        squared: boolean;
    },
    btn: {
        variant: ('solid' | 'soft' | 'subtle') = 'solid';
        [variant]: {
            ghost: (boolean | 'transparent' | 'translucent');
            outline: (boolean | 'subtle' | 'regular' | 'strong');
            underline: boolean;
            fill: boolean;
        };
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
        squared: boolean;
    },
    btn3D: {
        variant: ('solid' | 'soft' | 'subtle') = 'solid';
        [variant]: {
            outline: (boolean | 'subtle' | 'regular' | 'strong');
        };
        bordered: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
        squared: boolean;
    },
    checkbox: {
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    checkboxGroup: {
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
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
    inputSearch: {
        btnPosition: ('before' | 'after') = 'after';
    },
    inputText: {
        underline: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    placeholder: {
        size: size;
        radius: radius;
    },
    popup: {
        theme: theme;
    },
    radio: {
        theme: theme;
        size: size;
        radius: radius = 'full';
        spacing: spacing;
    },
    radioGroup: {
        theme: theme;
        size: size;
        radius: radius = 'full';
        spacing: spacing;
    },
    skeleton: {
        size: size;
        radius: radius;
        spacing: spacing;
    },
    slider: {
        theme: theme;
        size: size;
        radius: radius = 'full';
        spacing: spacing;
    },
    switch: {
        theme: theme;
        size: size;
        radius: radius = 'full';
        spacing: spacing;
    },
    textarea: {
        underline: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
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