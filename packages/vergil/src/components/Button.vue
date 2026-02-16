<script lang="ts">
import { resolveDynamicComponent } from 'vue'
import type { RouteLocationRaw, RouterLinkProps, _RouterLinkI } from 'vue-router'
import type { NuxtLinkProps } from 'nuxt/app'

type LinkOptions = Omit<RouterLinkProps, 'to'> | Omit<NuxtLinkProps, 'to' | 'href'>

function resolveComponent(_: 'NuxtLink') {
	/**
	 * <component is="RouterLink"/> uses resolveDynamicComponent
	 * @see https://github.com/vuejs/core/blob/v3.5.22/packages/runtime-core/src/helpers/resolveAssets.ts#L34
	 * @see https://github.com/vuejs/core/blob/v3.5.22/packages/compiler-core/src/transforms/transformElement.ts#L235
	 */
	const RouterLink = resolveDynamicComponent('RouterLink')
	return typeof RouterLink === 'string' ? 'a' : RouterLink
}

let Link: 'a' | _RouterLinkI
function resolveLink() {
	/**
	 * Nuxt replaces resolveComponent('NuxtLink')
	 * with the NuxtLink import at build-time.
	 * @see https://github.com/nuxt/nuxt/blob/v4.1.2/packages/nuxt/src/components/plugins/loader.ts#L51
	 */
    // @ts-ignore
    return Link ??= resolveComponent('NuxtLink')
}
</script>

<script setup lang="ts">
import { getCurrentInstance, withCtx } from 'vue'
import { vergil } from '#vergil'
import { useDefineExposed } from '#composables'
import { inferTheme, isValidRadius, isValidSize, isValidSpacing, isValidTheme, isValidVariant } from '#utilities'
import Icon from '#components/Icon'
import MiniMarkup from '#components/.internal/MiniMarkup'
import type { AnchorHTMLAttributes, PropType } from 'vue'
import type { ButtonVariant, ButtonOutline } from '#components'
import type { Exposed } from '#composables'
import type { Theme, Size, Radius, Spacing } from '#utilities'

const props = defineProps({
    exposed: Object as PropType<Exposed>,

    label: String,
    variant: {
        type: String as PropType<ButtonVariant>,
        default: () => vergil.config.button.variant,
        validator: (v: string) => isValidVariant('Button', v)
    },
    mask: {
        type: String as PropType<'ghost' | 'form-field'>,
        default: (props: { variant: ButtonVariant }) => vergil.config.button[props.variant]?.mask,
        validator: (v: string) => ['ghost', 'form-field'].includes(v)
    },
    outline: {
        type: [Boolean, String] as PropType<boolean | ButtonOutline>,
        default: (props: { variant: ButtonVariant }) => vergil.config.button[props.variant]?.outline,
        validator: (v: boolean | string) => (typeof v === 'boolean') || ['regular', 'subtle', 'strong'].includes(v)
    },
    underline: {
        type: Boolean,
        default: (props: { variant: ButtonVariant }) => vergil.config.button[props.variant]?.underline,
    },
    fill: {
        type: Boolean,
        default: (props: { variant: ButtonVariant }) => vergil.config.button[props.variant]?.fill,
    },
    icon: String,
    iconLeft: String,
    iconRight: String,
    squared: {
        type: Boolean,
        default: (props: Record<string, string>) => vergil.config.button.squared || Boolean(!props.label && (props.icon || props.iconLeft || props.iconRight))
    },
    disabled: Boolean,
    loading: Boolean,

	linkTo: [String, Object] as PropType<RouteLocationRaw>,
    linkOptions: Object as PropType<AnchorHTMLAttributes | LinkOptions>,
    linkUnderline: Boolean,

    descendant: Boolean,
    theme: {
        type: String as PropType<Theme>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.button.theme ?? vergil.config.global.theme),
        validator: isValidTheme
    },
    interactionTheme: {
        type: String as PropType<Theme>,
        validator: isValidTheme
    },
    size: {
        type: String as PropType<Size>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.button.size ?? vergil.config.global.size),
        validator: isValidSize
    },
    radius: {
        type: String as PropType<Radius>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.button.radius ?? vergil.config.global.radius),
        validator: isValidRadius
    },
    spacing: {
        type: String as PropType<Spacing>,
        default: (props: { descendant?: boolean }) => props.descendant ? undefined : (vergil.config.button.spacing ?? vergil.config.global.spacing),
        validator: isValidSpacing
    }
})

// A single effect function could be used if pausing dependency tracking were possible;
// currently, calling `useLink` would track unwanted dependencies.
useDefineExposed([
    () => {
        const { linkTo } = props
        return linkTo ? [linkTo, props.linkOptions] as const : []
    },
    /**
     * withCtx required for vue-router's useLink and for useNuxtLink to inject RouterLink
     * @see https://github.com/vuejs/core/blob/v3.5.22/packages/runtime-core/src/componentRenderContext.ts#L70
     */
    withCtx(([linkTo, linkOptions]: [RouteLocationRaw, LinkOptions]) => {
        if (linkTo) {
            const Link = resolveLink()
            return typeof Link === 'string'
                ? null
                : Link.useLink({ ...linkOptions, to: linkTo })
        } else {
            return null
        }
    }, getCurrentInstance()) as () => object | null
])
</script>

<template>
    <component :is="linkTo ? resolveLink() : 'button'"
        v-bind="linkTo && { ...linkOptions, [resolveLink() === 'a' ? 'href' : 'to']: linkTo }"
        :class="['button', variant, mask && `masked mask-${mask}`, {
            underline,
            fill,
            squared,
            loading,
            [inferTheme(theme)]: theme,
            [`interactive-${inferTheme(interactionTheme)}`]: interactionTheme,
            [`size-${size}`]: size,
            [`radius-${radius}`]: radius,
            [`spacing-${spacing}`]: spacing,
            [`outline-${outline === true ? 'regular' : outline}`]: outline,
            'link-underline': linkUnderline
        }]"
        :disabled="disabled || loading"
    >
        <span v-if="mask" class="button-backdrop"/>
        <div class="button-content">
            <Icon v-if="icon || iconLeft" :code="icon || iconLeft"/>
            <slot>
                <p v-if="label" class="button-label">
                    <MiniMarkup :str="label"/>
                </p>
            </slot>
            <Icon v-if="iconRight" :code="iconRight"/>
            <div v-if="loading" class="button-loader">
                <span class="button-spinner"/>
            </div>
        </div>
        <slot name="aside"/>
    </component>
</template>

<style>
:is(button, a).button {
    --button-c-icon: var(--button-c-icon-1);
    --button-c-border: var(--button-c-border-1);
    --button-bw: 0px;

    font-size: var(--font-size);
    line-height: var(--line-height-text);
    padding: var(--g-gap-md) var(--g-gap-2xl);
    border-radius: var(--g-radius-full, var(--g-radius-md));
    background-color: var(--button-c-1);
    color: var(--button-c-text-1);
    box-shadow: inset 0 calc(var(--button-bw-b, 0px) * -1) var(--button-c-border-b, transparent),
                inset 0 0 0 var(--button-bw) var(--button-c-border, transparent);

    position: relative;
    border: none;
    font-weight: 500;
    text-decoration: none;
    outline: 0 solid transparent;
    transition: background-color 150ms, color 150ms, box-shadow 150ms;

    &:not(.loading) {
        &:is(:hover, :focus-visible, :active) {
            --button-c-icon: var(--button-c-icon-2);
            --button-c-border: var(--button-c-border-2);
            color: var(--button-c-text-2);

            &:is(a.link-underline) > .button-content > .button-label {
                box-shadow: inset 0 -0.8px var(--button-c-icon-2, var(--button-c-text-2));
            }
        }
        &:is(:hover, :focus-visible) {
            &:not(.fill) {
                background-color: var(--button-c-2);
            }
            &.fill:not(:disabled) > .button-backdrop {
                height: 100%;
                background-color: var(--button-c-2);
            }
        }
        &:active {
            &:where(.solid) {
                --button-c-border-b: transparent;
            }
            &:not(.fill), &.fill:not(:disabled) > .button-backdrop {
                background-color: var(--button-c-3);
            }
        }
        &:disabled {
            --button-c-icon: var(--c-disabled-text);
            cursor: not-allowed;
            color: var(--c-disabled-text);

            &:is(.solid, .soft) {
                --button-c-border: var(--c-disabled-border-2);
                background-color: var(--c-disabled-2);
            }
            &.subtle, &.mask-form-field {
                --button-c-border: var(--c-disabled-border-1);
                background-color: var(--c-disabled-1);
            }
            &.underline {
                --button-c-border-b: var(--c-disabled-border-3);
            }
        }

        &.mask-ghost {
            --button-c-1: transparent;
            --button-c-text-1: var(--c-theme-text-1);
            --button-c-icon-1: var(--c-theme-1);
        }
        &.mask-form-field {
            font-weight: 400;
            --button-c-1: var(--c-bg);
            --button-c-text-1: var(--c-grey-text-2);
            --button-c-icon-1: var(--c-grey-1);
        }
    }
    &:focus-visible {
        outline: 2px solid var(--c-theme-outline);
        &:is(.solid, .outline, .underline) {
            outline-offset: 3px;
        }
    }
    &.loading {
        cursor: progress;
        & > .button-content {
            background-color: inherit;
            & > .button-loader {
                background-color: inherit;
            }
        }
    }

    &.solid {
        --button-c-1: var(--c-theme-solid-1);
        --button-c-2: var(--c-theme-solid-2);
        --button-c-3: var(--c-theme-solid-3);
        --button-c-text-1: var(--c-theme-text-4);
        --button-c-text-2: var(--c-theme-text-4);
        --button-c-icon-1: var(--c-theme-text-3);
        --button-c-icon-2: var(--c-theme-text-3);
        &.masked {
            --button-c-2: var(--c-theme-solid-1);
            --button-c-3: var(--c-theme-solid-2);
        }
        & > .button-content .button-spinner {
            border-color: rgb(255 255 255 / 0.95);
            border-top-color: rgb(0 0 0 / 0.45);
        }
    }
    &.soft {
        --button-c-1: var(--c-theme-soft-2);
        --button-c-2: var(--c-theme-soft-3);
        --button-c-3: var(--c-theme-soft-4);
        &.masked {
            --button-c-2: var(--c-theme-soft-2);
            --button-c-3: var(--c-theme-soft-3);
        }
    }
    &.subtle {
        --button-c-1: var(--c-theme-soft-1);
        --button-c-2: var(--c-theme-soft-2);
        --button-c-3: var(--c-theme-soft-3);
        &.masked {
            --button-c-2: var(--c-theme-soft-1);
            --button-c-3: var(--c-theme-soft-2);
        }
    }
    &:is(.soft, .subtle) {
        --button-c-text-1: var(--c-theme-text-2);
        --button-c-text-2: var(--c-theme-text-2);
        & > .button-backdrop {
            box-shadow: inherit;
        }
        & .button-spinner{
            border-color: var(--c-theme-border-subtle);
            border-top-color: var(--c-theme-text-2);
        }
    }

    &:is(.outline-subtle, .outline-regular, .outline-strong) {
        --button-bw: 0.8px;
    }
    &.outline-subtle {
        --button-c-border-1: var(--c-theme-border-subtle);
        &:where(.soft, .subtle) {
            --button-c-border-2: var(--c-theme-border-subtle);
        }
        &:where(.mask-form-field) {
            --button-c-border-1: var(--c-grey-border-subtle);
        }
    }
    &.outline-regular {
        --button-c-border-1: var(--c-theme-border-regular);
        &:where(.soft, .subtle) {
            --button-c-border-2: var(--c-theme-border-regular);
        }
        &:where(.mask-form-field) {
            --button-c-border-1: var(--c-grey-border-regular);
        }
    }
    &.outline-strong {
        --button-c-border-1: var(--c-theme-1);
        &:where(.soft, .subtle) {
            --button-c-border-2: var(--c-theme-1);
        }
        &:where(.mask-form-field) {
            --button-c-border-1: var(--c-grey-1);
        }
    }
    &.underline {
        --button-bw-b: var(--component-border-bottom-width);
        --button-c-border-b: var(--c-theme-solid-1);
    }
    &.invalid {
        --button-bw: 1px;
        --button-c-border-1: var(--c-theme-solid-1);
    }
    &.fill {
        transition: background-color 150ms, color 200ms, box-shadow 150ms;
        & > .button-content > .icon {
            transition: color 200ms;
        }
    }
    &.squared {
        padding: var(--g-gap-md);
    }

    & > .button-backdrop{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
        background-color: transparent;
        border-radius: inherit;
        transition: height 150ms linear, background-color 150ms ease-in, box-shadow 150ms ease-in;
    }
    & > .button-content {
        font-size: 1em;
        position: relative;
        display: grid;
        grid-auto-flow: column;
        justify-content: center;
        column-gap: var(--g-gap-md);

        &::selection {
            background-color: transparent;
        }

        & > .button-label {
            transition: box-shadow 150ms;
        }

        & > .icon {
            font-size: calc(1em * var(--font-size-scale-icon));
            line-height: var(--line-height-icon);
            aspect-ratio: 1 / 1;
            color: var(--button-c-icon, inherit);
            transition: color 150ms;
        }

        & > .button-loader {
            font-size: 1em;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            writing-mode: vertical-lr;

            & > .button-spinner {
                font-size: 1em;
                height: 100%;
                margin: calc((100% - (1em * var(--font-size-scale-icon))) / 2) 0;
                aspect-ratio: 1 / 1;
                border-width: 3px;
                border-style: solid;
                border-top-width: 3px;
                border-top-style: solid;
                border-radius: 50%;
                animation: spin 1000ms linear infinite;
            }
        }
    }
}

.button-group > .button {
    &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    &:not(:first-child, :last-child) {
        border-radius: 0;
    }
    &:not(:first-child) {
        margin-left: calc(-1 * var(--button-bw));
    }
    &:hover {
        z-index: 1;
    }
    &:focus-visible {
        z-index: 2;
    }
}
</style>