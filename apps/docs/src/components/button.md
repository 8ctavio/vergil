---
outline: [2,3]
---

# Button

> Button element to handle click events

<script setup>
import { Button } from 'vergil/components'
</script>

## Basic Usage

<Demo>
    <Button>Keep it Clean!</Button>
</Demo>

```vue
<script setup>
import { Button } from '@vrgl/vergil/components'
</script>

<template>
    <Button>Keep it Clean!</Button>
</template>
```

## Props

### Label <Badge type="tip"><pre>label: string</pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

Simple `Button` text content can be specified through the default slot or the `label` prop. The slot content overrides the `label` prop.

```vue
<Button label="Click"/>
```

### Variant <Badge><pre>variant: ('solid' | 'soft' | 'subtle') = 'solid'</pre></Badge>

<Demo>
    <Button variant="solid" label="Solid"/>
    <Button variant="soft" label="Soft"/>
    <Button variant="subtle" label="Subtle"/>
</Demo>

### Mask <Badge><pre>mask: ('ghost' | 'form-field')</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button mask="ghost" label="Ghost" variant="solid"/>
            <Button mask="ghost" label="Ghost" variant="soft"/>
            <Button mask="ghost" label="Ghost" variant="subtle"/>    
        </div>
        <div class="row center">
            <Button mask="form-field" label="Form Field" variant="solid"/>
            <Button mask="form-field" label="Form Field" variant="soft"/>
            <Button mask="form-field" label="Form Field" variant="subtle"/>  
        </div>
    </div>
</Demo>

### Outline <Badge><pre>outline: (boolean | 'subtle' | 'regular' | 'strong')</pre></Badge>

The `'regular'` and `true` values are equivalent. For the `solid` variant, only buttons with `mask` are affected.

<Demo>
    <div class="col center">
        <div class="row center">
            <Button variant="solid" outline="subtle" label="Subtle" mask="ghost"/>
            <Button variant="solid" outline="regular" label="Regular" mask="ghost"/>
            <Button variant="solid" outline="strong" label="Strong" mask="ghost"/>
        </div>
        <div class="row center">
            <Button variant="solid" outline="subtle" label="Subtle" mask="form-field"/>
            <Button variant="solid" outline="regular" label="Regular" mask="form-field"/>
            <Button variant="solid" outline="strong" label="Strong" mask="form-field"/>
        </div>
        <div class="row center">
            <Button variant="soft" outline="subtle" label="Subtle"/>
            <Button variant="soft" outline="regular" label="Regular"/>    
            <Button variant="soft" outline="strong" label="Strong"/>    
        </div>
        <div class="row center">
            <Button variant="subtle" outline="subtle" label="Subtle"/>
            <Button variant="subtle" outline="regular" label="Regular"/>    
            <Button variant="subtle" outline="strong" label="Strong"/>    
        </div>
    </div>
</Demo>

### Fill <Badge><pre>fill: boolean</pre></Badge> <Badge type="warning">only for *masked* buttons</Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button fill mask="ghost" variant="solid" label="Hover me!"/>
            <Button fill mask="ghost" variant="soft" label="Hover me!"/>
            <Button fill mask="ghost" variant="subtle" label="Hover me!"/>
        </div>
        <div class="row center">
            <Button fill mask="form-field" variant="solid" label="Hover me!"/>
            <Button fill mask="form-field" variant="soft" label="Hover me!"/>
            <Button fill mask="form-field" variant="subtle" label="Hover me!"/>
        </div>
    </div>
</Demo>

### Underline <Badge><pre>underline: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button underline fill mask="ghost" variant="solid" label="Underline"/>
            <Button underline fill mask="ghost" variant="soft" label="Underline"/>
            <Button underline fill mask="ghost" variant="subtle" label="Underline"/>
        </div>
        <div class="row center">
            <Button underline fill mask="form-field" variant="solid" label="Underline"/>
            <Button underline fill mask="form-field" variant="soft" label="Underline"/>
            <Button underline fill mask="form-field" variant="subtle" label="Underline"/>
        </div>
    </div>
</Demo>

### Icon <Badge><pre>icon: string</pre></Badge> <Badge type="info">alias: <pre>icon-left</pre></Badge>

```vue
<Button icon="rocket_launch"/>
```

<Demo>
    <Button icon="rocket_launch" theme="brand" variant="solid"/>
    <Button icon="rocket_launch" theme="brand" variant="soft"/>
    <Button icon="rocket_launch" theme="brand" variant="subtle" outline="subtle"/>
    <Button icon="rocket_launch" theme="brand" variant="soft" mask="ghost"/>
</Demo>

### Icon Right <Badge><pre>icon-right: string</pre></Badge>

```vue
<Button label="Omega" icon-right="special_character"/>
```

<Demo>
    <Button label="Omega" icon-right="special_character" variant="solid"/>
    <Button label="Omega" icon-right="special_character" variant="soft"/>
    <Button label="Omega" icon-right="special_character" variant="subtle"/>
</Demo>

### Squared <Badge type="tip"><pre>squared: boolean</pre></Badge>

Adding `squared` sets padding to the same value on all sides.

<Demo>
    <Button squared label="Squared"/>
</Demo>

### Link to <Badge><pre>link-to: [RouteLocationRaw](https://router.vuejs.org/api/type-aliases/RouteLocationRaw.html#RouteLocationRaw-Name-)</pre></Badge>

The `link-to` prop instructs `Button` to mount an `a` element instead of a `button`. In addition, `Button` supports `RouterLink` and `NuxtLink` by automatically rendering whichever is available when `link-to` is used (`NuxtLink` has precedence over `RouterLink`).

If a plain `a` element is mounted, `link-to` becomes its `href` attribute. Otherwise, `link-to` is equivalent to `RouterLink`'s `to` prop.

```vue
<Button label="Link" link-to="/path"/>
```
<Demo>
    <Button label="Link" link-to="/vergil/components/button#link-to-link-to-routelocationraw"/>
</Demo>

### Link options <Badge><pre>link-options: AnchorHTMLAttributes | Omit<[RouterLinkProps](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#RouterLinkProps), 'to'> | Omit<[NuxtLinkProps](https://nuxt.com/docs/4.x/api/components/nuxt-link#props), 'to' | 'href'></pre></Badge>

Additional attributes or props for underlying `a` element, or `RouterLink` or `NuxtLink` components if `link-to` is provided.

```vue
<Button
    label="External Link"
    link-to="/path"
    :link-options="{ target: '_blank' }"
/>
```
<Demo>
    <Button label="External Link"link-to="/vergil/components/button#link-to-link-to-routelocationraw"  :link-options="{ target: '_blank' }"/>
</Demo>

### Link underline <Badge><pre>link-underline: boolean</pre></Badge>

Underlines `Button`'s label on hover when `link-to` is provided.

```vue
<Button label="Link underline" link-to="/path" link-underline/>
```
<Demo>
    <Button label="Link underline" link-to="/vergil/components/button#link-underline-link-underline-boolean" link-underline/>
</Demo>

### Theme <Badge type="tip"><pre>theme: [Theme](/theme#the-theme-prop) = 'brand'</pre></Badge>

<Demo>
    <div class="col">
        <div class="row center">
            <Button variant="solid" theme="brand" label="Brand"/>
            <Button variant="solid" theme="user" label="User"/>
            <Button variant="solid" theme="ok" label="Ok"/>
            <Button variant="solid" theme="info" label="Info"/>
            <Button variant="solid" theme="warn" label="Warn"/>
            <Button variant="solid" theme="danger" label="Danger"/>
            <Button variant="solid" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="soft" theme="brand" label="Brand"/>
            <Button variant="soft" theme="user" label="User"/>
            <Button variant="soft" theme="ok" label="Ok"/>
            <Button variant="soft" theme="info" label="Info"/>
            <Button variant="soft" theme="warn" label="Warn"/>
            <Button variant="soft" theme="danger" label="Danger"/>
            <Button variant="soft" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="soft" outline="subtle" theme="brand" label="Brand"/>
            <Button variant="soft" outline="subtle" theme="user" label="User"/>
            <Button variant="soft" outline="subtle" theme="ok" label="Ok"/>
            <Button variant="soft" outline="subtle" theme="info" label="Info"/>
            <Button variant="soft" outline="subtle" theme="warn" label="Warn"/>
            <Button variant="soft" outline="subtle" theme="danger" label="Danger"/>
            <Button variant="soft" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="soft" outline="regular" theme="brand" label="Brand"/>
            <Button variant="soft" outline="regular" theme="user" label="User"/>
            <Button variant="soft" outline="regular" theme="ok" label="Ok"/>
            <Button variant="soft" outline="regular" theme="info" label="Info"/>
            <Button variant="soft" outline="regular" theme="warn" label="Warn"/>
            <Button variant="soft" outline="regular" theme="danger" label="Danger"/>
            <Button variant="soft" outline="regular" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="soft" outline="strong" theme="brand" label="Brand"/>
            <Button variant="soft" outline="strong" theme="user" label="User"/>
            <Button variant="soft" outline="strong" theme="ok" label="Ok"/>
            <Button variant="soft" outline="strong" theme="info" label="Info"/>
            <Button variant="soft" outline="strong" theme="warn" label="Warn"/>
            <Button variant="soft" outline="strong" theme="danger" label="Danger"/>
            <Button variant="soft" outline="strong" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="subtle" theme="brand" label="Brand"/>
            <Button variant="subtle" theme="user" label="User"/>
            <Button variant="subtle" theme="ok" label="Ok"/>
            <Button variant="subtle" theme="info" label="Info"/>
            <Button variant="subtle" theme="warn" label="Warn"/>
            <Button variant="subtle" theme="danger" label="Danger"/>
            <Button variant="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="subtle" outline="subtle" theme="brand" label="Brand"/>
            <Button variant="subtle" outline="subtle" theme="user" label="User"/>
            <Button variant="subtle" outline="subtle" theme="ok" label="Ok"/>
            <Button variant="subtle" outline="subtle" theme="info" label="Info"/>
            <Button variant="subtle" outline="subtle" theme="warn" label="Warn"/>
            <Button variant="subtle" outline="subtle" theme="danger" label="Danger"/>
            <Button variant="subtle" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="subtle" outline="regular" theme="brand" label="Brand"/>
            <Button variant="subtle" outline="regular" theme="user" label="User"/>
            <Button variant="subtle" outline="regular" theme="ok" label="Ok"/>
            <Button variant="subtle" outline="regular" theme="info" label="Info"/>
            <Button variant="subtle" outline="regular" theme="warn" label="Warn"/>
            <Button variant="subtle" outline="regular" theme="danger" label="Danger"/>
            <Button variant="subtle" outline="regular" theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="subtle" outline="strong" theme="brand" label="Brand"/>
            <Button variant="subtle" outline="strong" theme="user" label="User"/>
            <Button variant="subtle" outline="strong" theme="ok" label="Ok"/>
            <Button variant="subtle" outline="strong" theme="info" label="Info"/>
            <Button variant="subtle" outline="strong" theme="warn" label="Warn"/>
            <Button variant="subtle" outline="strong" theme="danger" label="Danger"/>
            <Button variant="subtle" outline="strong" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

<Demo>
    <div class="col">
        <div class="row center">
            <Button variant="solid" mask="ghost" outline theme="brand" label="Brand"/>
            <Button variant="solid" mask="ghost" outline theme="user" label="User"/>
            <Button variant="solid" mask="ghost" outline theme="ok" label="Ok"/>
            <Button variant="solid" mask="ghost" outline theme="info" label="Info"/>
            <Button variant="solid" mask="ghost" outline theme="warn" label="Warn"/>
            <Button variant="solid" mask="ghost" outline theme="danger" label="Danger"/>
            <Button variant="solid" mask="ghost" outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="soft" mask="ghost" outline theme="brand" label="Brand"/>
            <Button variant="soft" mask="ghost" outline theme="user" label="User"/>
            <Button variant="soft" mask="ghost" outline theme="ok" label="Ok"/>
            <Button variant="soft" mask="ghost" outline theme="info" label="Info"/>
            <Button variant="soft" mask="ghost" outline theme="warn" label="Warn"/>
            <Button variant="soft" mask="ghost" outline theme="danger" label="Danger"/>
            <Button variant="soft" mask="ghost" outline theme="neutral" label="Neutral"/>
        </div>
        <div class="row center">
            <Button variant="subtle" mask="ghost" outline="subtle" theme="brand" label="Brand"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="user" label="User"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="ok" label="Ok"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="info" label="Info"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="warn" label="Warn"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="danger" label="Danger"/>
            <Button variant="subtle" mask="ghost" outline="subtle" theme="neutral" label="Neutral"/>
        </div>
    </div>
</Demo>

### Interaction Theme <Badge type="tip"><pre>interaction-theme: [Theme](/theme#the-theme-prop)</pre></Badge>

<Demo>
    <div class="row center">
        <Button variant="soft" outline theme="neutral" interaction-theme="brand" label="Brand"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="user" label="User"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="ok" label="Ok"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="info" label="Info"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="warn" label="Warn"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="danger" label="Danger"/>
        <Button variant="soft" outline theme="neutral" interaction-theme="neutral" label="Neutral"/>
    </div>
</Demo>

### Size <Badge><pre>size: ('xs' | 'sm' | 'md' | 'lg' | 'xl') = 'md'</pre></Badge>

<Demo>
    <Button size="xs" label="Extra Small"/>
    <Button size="sm" label="Small"/>
    <Button size="md" label="Medium"/>
    <Button size="lg" label="Large"/>
    <Button size="xl" label="Extra Large"/>
</Demo>

### Radius <Badge type="tip"><pre>radius: ('none' | 'sm' | 'md' | 'lg' | 'full') = 'md'</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button label="Radius" size="xs" radius="none"/>
            <Button label="Radius" size="sm" radius="none"/>  
            <Button label="Radius" size="md" radius="none"/>
            <Button label="Radius" size="lg" radius="none"/>
            <Button label="Radius" size="xl" radius="none"/>
        </div>
        <div class="row center">
            <Button label="Radius" size="xs" radius="sm"/>
            <Button label="Radius" size="sm" radius="sm"/>
            <Button label="Radius" size="md" radius="sm"/>
            <Button label="Radius" size="lg" radius="sm"/>
            <Button label="Radius" size="xl" radius="sm"/>
        </div>
        <div class="row center">
            <Button label="Radius" size="xs" radius="md"/>
            <Button label="Radius" size="sm" radius="md"/>
            <Button label="Radius" size="md" radius="md"/>
            <Button label="Radius" size="lg" radius="md"/>
            <Button label="Radius" size="xl" radius="md"/>
        </div>
        <div class="row center">
            <Button label="Radius" size="xs" radius="lg"/>
            <Button label="Radius" size="sm" radius="lg"/>
            <Button label="Radius" size="md" radius="lg"/>
            <Button label="Radius" size="lg" radius="lg"/>
            <Button label="Radius" size="xl" radius="lg"/>
        </div>
        <div class="row center">
            <Button label="Radius" size="xs" radius="full"/>
            <Button label="Radius" size="sm" radius="full"/>  
            <Button label="Radius" size="md" radius="full"/>
            <Button label="Radius" size="lg" radius="full"/>
            <Button label="Radius" size="xl" radius="full"/>
        </div>
    </div>
</Demo>

### Spacing <Badge type="tip"><pre>spacing: ('compact' | 'expanded') = ''</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button size="xs" spacing="compact" label="Compact"/>
            <Button size="xs" label="Default"/>
            <Button size="xs" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Button size="sm" spacing="compact" label="Compact"/>
            <Button size="sm" label="Default"/>
            <Button size="sm" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Button size="md" spacing="compact" label="Compact"/>
            <Button size="md" label="Default"/>
            <Button size="md" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Button size="lg" spacing="compact" label="Compact"/>
            <Button size="lg" label="Default"/>
            <Button size="lg" spacing="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Button size="xl" spacing="compact" label="Compact"/>
            <Button size="xl" label="Default"/>
            <Button size="xl" spacing="expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

### Disabled <Badge type="tip"><pre>disabled: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button disabled label="Disabled" variant="solid"/>
            <Button disabled label="Disabled" variant="soft"/>
            <Button disabled label="Disabled" variant="subtle"/>
        </div>
        <div class="row center">
            <Button disabled label="Disabled" outline variant="solid"/>
            <Button disabled label="Disabled" outline variant="soft"/>
            <Button disabled label="Disabled" outline variant="subtle"/>
        </div>
        <div class="row center">
            <Button disabled label="Disabled" underline variant="solid"/>
            <Button disabled label="Disabled" underline variant="soft"/>
            <Button disabled label="Disabled" underline variant="subtle"/>
        </div>
    </div>
</Demo>

### Loading <Badge><pre>loading: boolean</pre></Badge>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button loading label="Loading" mask="ghost" variant="solid"/>
            <Button loading label="Loading" mask="ghost" variant="soft"/>
            <Button loading label="Loading" mask="ghost" variant="subtle"/>
        </div>
        <div class="row center">
            <Button loading label="Loading" outline="subtle" variant="solid"/>
            <Button loading label="Loading" outline="subtle" variant="soft"/>
            <Button loading label="Loading" outline="subtle" variant="subtle"/>
        </div>
        <div class="row center">
            <Button loading label="Loading" underline variant="solid"/>
            <Button loading label="Loading" underline variant="soft"/>
            <Button loading label="Loading" underline variant="subtle"/>
        </div>
    </div>
</Demo>

<Demo>
    <div class="row center">
        <Button label="Loading" loading theme="user" variant="solid"/>
        <Button label="Loading" loading theme="user" variant="soft"/>
        <Button label="Loading" loading theme="user" variant="subtle"/>
    </div>
    <div class="row center">
        <Button label="Loading" loading theme="ok" variant="solid"/>
        <Button label="Loading" loading theme="ok" variant="soft"/>
        <Button label="Loading" loading theme="ok" variant="subtle"/>
    </div>
    <div class="row center">
        <Button label="Loading" loading theme="info" variant="solid"/>
        <Button label="Loading" loading theme="info" variant="soft"/>
        <Button label="Loading" loading theme="info" variant="subtle"/>
    </div>
    <div class="row center">
        <Button label="Loading" loading theme="warn" variant="solid"/>
        <Button label="Loading" loading theme="warn" variant="soft"/>
        <Button label="Loading" loading theme="warn" variant="subtle"/>
    </div>
    <div class="row center">
        <Button label="Loading" loading theme="danger" variant="solid"/>
        <Button label="Loading" loading theme="danger" variant="soft"/>
        <Button label="Loading" loading theme="danger" variant="subtle"/>
    </div>
    <div class="row center">
        <Button label="Loading" loading theme="neutral" variant="solid"/>
        <Button label="Loading" loading theme="neutral" variant="soft"/>
        <Button label="Loading" loading theme="neutral" variant="subtle"/>
    </div>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Button label="Loading" loading size="xs" spacing="compact"/>
            <Button label="Loading" loading size="xs"/>
            <Button label="Loading" loading size="xs" spacing="expanded"/>
        </div>
        <div class="row center">
            <Button label="Loading" loading size="sm" spacing="compact"/>
            <Button label="Loading" loading size="sm"/>
            <Button label="Loading" loading size="sm" spacing="expanded"/>
        </div>
        <div class="row center">
            <Button label="Loading" loading size="md" spacing="compact"/>
            <Button label="Loading" loading size="md"/>
            <Button label="Loading" loading size="md" spacing="expanded"/>
        </div>
        <div class="row center">
            <Button label="Loading" loading size="lg" spacing="compact"/>
            <Button label="Loading" loading size="lg"/>
            <Button label="Loading" loading size="lg" spacing="expanded"/>
        </div>
        <div class="row center">
            <Button label="Loading" loading size="xl" spacing="compact"/>
            <Button label="Loading" loading size="xl"/>
            <Button label="Loading" loading size="xl" spacing="expanded"/>
        </div>
    </div>
</Demo>

## Button group

An element with a `button-group` class can be used to group `Button` components together:

```html
<div class="button-group">
    <Button variant="soft" outline squared theme="neutral" interaction-theme="brand" icon="edit"/>
    <Button variant="soft" outline squared theme="neutral" interaction-theme="danger" icon="delete"/>
</div>
```

<Demo>
    <div class="button-group">
        <Button variant="soft" outline squared theme="neutral" interaction-theme="brand" icon="edit"/>
        <Button variant="soft" outline squared theme="neutral" interaction-theme="danger" icon="delete"/>
    </div>
</Demo>

## Exposed

### Link instance

When `link-to` is provided and `RouterLink` or `NuxtLink` is rendered, a corresponding [`useLink`](https://router.vuejs.org/api/functions/useLink.html#useLink-) or [`useNuxtLink`](https://github.com/nuxt/nuxt/blob/v4.2.1/packages/nuxt/src/app/components/nuxt-link.ts#L171) instance is exposed.

The exposed link instance may be used, for example, to update `Button` props based on whether the link is active:

```vue
<script setup>
import { useExposed } from '@vrgl/vergil'
const exposed = useExposed()
</script>

<template>
    <Button :exposed link-to="/"
        :theme="exposed.isActive ? 'brand' : 'neutral'"
    />
</template>
```

:::warning
If `link-to` is an object defined in-template, an infinite loop may be generated if template-tracked exposed properties are triggered because when the template is re-rendered a new object may be created for `link-to`. In that case, `Button` internally creates and exposes a new link instance, and triggers the `exposed` object, which in turn triggers another template re-render, and so on. To prevent this, defining a `link-to` object directly in the template should be avoided:

```vue
<script setup>
import { useExposed } from '@vrgl/vergil'
const exposed = useExposed()
const linkTo = {/* ... */}  // [!code ++]
</script>

<template>
    <Button :exposed link-to="{/* ... */}" v-bind="f(exposed)"/> <!-- [!code --] -->
    <Button :exposed :link-to v-bind="f(exposed)"/> <!-- [!code ++] -->
</template>
```
:::

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `label` | `string` | |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` |
| `mask` | `'ghost' \| 'form-field'` | |
| `outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | |
| `underline` | `boolean` | |
| `fill` | `boolean` | |
| `icon` | `string` | |
| `iconLeft` | `string` | |
| `iconRight` | `string` | |
| `squared` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `linkTo` | `RouteLocationRaw` | |
| `linkOptions` | `AnchorHTMLAttributes \| Omit<RouterLinkProps, 'to'> \| Omit<NuxtLinkProps, 'to' \| 'href'>` | |
| `linkUnderline` | `boolean` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `interactionTheme` | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |
| `exposed` | `object` | |

### Configuration options

`Button`'s [configuration options](/configuration) allow to overwrite some `Button` props' default values and may be overwritten under the `button` root-level configuration option.

| `button.<option>` | type | default | [global](/configuration#global-configuration-options) |
| -------------- | ---- | ------- | :------: |
| `variant` | `'solid' \| 'soft' \| 'subtle'` | `'solid'` | |
| `<variant>.mask` | `'ghost' \| 'form-field'` | | |
| `<variant>.outline` | `boolean \| 'subtle' \| 'regular' \| 'strong'` | | |
| `<variant>.underline` | `boolean` | | |
| `<variant>.fill` | `boolean` | | |
| `squared` | `boolean` | | |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="button" classes="button">
        <Anatomy tag="span" classes="button-backdrop"/>
        <Anatomy tag="div" classes="button-content">
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag='slot name="default"'/>
            <Anatomy tag="Icon" classes="icon"/>
            <Anatomy tag="div" classes="button-loader">
                <Anatomy tag="span" classes="button-spinner">
                    <Anatomy tag="p" classes="button-label"/>
                </Anatomy>
            </Anatomy>
        </Anatomy>
        <Anatomy tag='slot name="aside"'/>
    </Anatomy>
</Demo>