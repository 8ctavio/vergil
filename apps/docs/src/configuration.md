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
type size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type spacing = '' | 'compact' | 'expanded'
type theme = 'brand' | 'user' | 'ok' | 'info' | 'warn' | 'danger' | 'neutral'
type toastPosition = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end'
type placement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'` | `'top'

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
    calendar: {
        locale: (string | string[] | object) = 'en';
        firstWeekday: number = 0;
        timeFormat: ('24' | '12') = '24';
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    checkbox: {
        variant: ('classic' | 'card' | 'list' | 'toggle') = 'classic';
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    confirm: {
        size: size;
        radius: radius;
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
    datalist: {
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    datePicker: {
        placeholderFallback: ((n: number) => string) = (n => `${n} Dates Selected`);
        sideButtonPosition: ('before' | 'after') = 'after';
        underline: boolean;
        fill: boolean;
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
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
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    popover: {
        padding: number = 6;
        delay: number = 400;
    },
    popup: {
        theme: theme;
        size: size;
        radius: radius;
    },
    radio: {
        variant: ('classic' | 'card' | 'list' | 'toggle') = 'classic';
        radioRadius: radius = 'full';
        theme: theme;
        size: size;
        radius: radius;
        spacing: spacing;
    },
    select: {
        placeholderFallback: ((n: number) => string) = (n => `${n} Selected`);
        placeholderNotFound: ((query: string) => string) = (query => `No results for [["${query}"]]`);
        placeholderFilter: string = 'Filter';
        underline: boolean;
        fill: boolean;
        theme: theme;
        size: size;
        radius: radius;
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
        size: size;
        radius: radius;
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
    },
    tooltip: {
        arrow: false;
        offset: arrow => arrow ? 2 : 5;
        placement: placement = 'top';
    }
}
```