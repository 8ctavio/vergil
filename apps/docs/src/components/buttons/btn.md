---
outline: [2,3]
---

# Btn

> Button element to handle click events

<script setup>
    import { Btn } from 'vergil/components'
</script>

## Basic Usage

```vue
<script setup>
    import { Btn } from 'vergil/components'
</script>

<template>
    <Btn>Keep it Clean!</Btn>
</template>
```
<Demo>
    <Btn>Keep it Clean!</Btn>
</Demo>

::: tip
Use the `.btn` css selector to target a `Btn` component.
:::

### Label <Badge type="info"><pre>label</pre> prop</Badge>

The `Btn` label can be specified through the default slot or via a `label` prop. The slot content overrides the `label` prop.

```vue
<Btn label="Click"/>
```

## Types <Badge type="info">class</Badge>

The type of a `Btn` refers to the overall design of the button. It can be specified through a class. Possible class values for types are

- `default`
- `primary`
- `secondary`
- `outlined`
- `text`

::: tip
If none of this classes is explicitly specified, the `default` class is automatically appended.
:::

```vue
<Btn class="default" label="Default"/>
<Btn class="primary" label="Primary"/>
<Btn class="secondary" label="Secondary"/>
<Btn class="outlined" label="Outlined"/>
<Btn class="text" label="Text"/>
```
<Demo>
    <Btn class="default brand" label="Default"/>
    <Btn class="primary" label="Primary"/>
    <Btn class="secondary" label="Secondary"/>
    <Btn class="outlined" label="Outlined"/>
    <Btn class="text" label="text"/>
</Demo>

### Default

#### Fill Hover Mode <Badge type="info"><pre>fill</pre> class</Badge>

```vue
<Btn class="fill" label="Hover me!"/>
```
<Demo>
    <Btn class="fill" label="Hover me!"/>
</Demo>

#### Borderless <Badge type="info"><pre>borderless</pre> class</Badge>

```vue
<Btn class="borderless" label="Borderless"/>
```
<Demo>
    <Btn class="borderless" label="Borderless"/>
</Demo>

## Themes <Badge type="info">class</Badge>

A `Btn` theme refers to the color theme applied to any button type. It can be specified through a class. Possible class values for themes are

- `brand`
- `ok`
- `info`
- `warn`
- `danger`
- `gray`

::: tip
If none of this classes is explicitly specified, the `brand` class is automatically appended.
:::

```vue
<Btn class="brand" label="Brand"/>
<Btn class="ok" label="Ok"/>
<Btn class="info" label="Info"/>
<Btn class="warn" label="Warn"/>
<Btn class="danger" label="Danger"/>
<Btn class="gray" label="Gray"/>
```

<Demo>
    <Btn class="brand" label="Brand"/>
    <Btn class="ok" label="Ok"/>
    <Btn class="info" label="Info"/>
    <Btn class="warn" label="Warn"/>
    <Btn class="danger" label="Danger"/>
    <Btn class="gray" label="Gray"/>
</Demo>


```vue
<Btn class="primary" label="Brand"/>
<Btn class="primary ok" label="Ok"/>
<Btn class="primary info" label="Info"/>
<Btn class="primary warn" label="Warn"/>
<Btn class="primary danger" label="Danger"/>
<Btn class="primary gray" label="Gray"/>

<Btn class="secondary" label="Brand"/>
<Btn class="secondary ok" label="Ok"/>
<Btn class="secondary info" label="Info"/>
<Btn class="secondary warn" label="Warn"/>
<Btn class="secondary danger" label="Danger"/>
<Btn class="secondary gray" label="Gray"/>

<Btn class="outlined" label="Brand"/>
<Btn class="outlined ok" label="Ok"/>
<Btn class="outlined info" label="Info"/>
<Btn class="outlined warn" label="Warn"/>
<Btn class="outlined danger" label="Danger"/>
<Btn class="outlined gray" label="Gray"/>

<Btn class="text" label="Brand"/>
<Btn class="text ok" label="Ok"/>
<Btn class="text info" label="Info"/>
<Btn class="text warn" label="Warn"/>
<Btn class="text danger" label="Danger"/>
<Btn class="text gray" label="Gray"/>
```

<Demo>
    <div class="col">
        <div class="row center">
            <Btn class="primary" label="Brand"/>
            <Btn class="primary ok" label="Ok"/>
            <Btn class="primary info" label="Info"/>
            <Btn class="primary warn" label="Warn"/>
            <Btn class="primary danger" label="Danger"/>
            <Btn class="primary gray" label="Gray"/>
        </div>
        <div class="row center">
            <Btn class="secondary" label="Brand"/>
            <Btn class="secondary ok" label="Ok"/>
            <Btn class="secondary info" label="Info"/>
            <Btn class="secondary warn" label="Warn"/>
            <Btn class="secondary danger" label="Danger"/>
            <Btn class="secondary gray" label="Gray"/>
        </div>
        <div class="row center">
            <Btn class="outlined" label="Brand"/>
            <Btn class="outlined ok" label="Ok"/>
            <Btn class="outlined info" label="Info"/>
            <Btn class="outlined warn" label="Warn"/>
            <Btn class="outlined danger" label="Danger"/>
            <Btn class="outlined gray" label="Gray"/>
        </div>
        <div class="row center">
            <Btn class="text" label="Brand"/>
            <Btn class="text ok" label="Ok"/>
            <Btn class="text info" label="Info"/>
            <Btn class="text warn" label="Warn"/>
            <Btn class="text danger" label="Danger"/>
            <Btn class="text gray" label="Gray"/>
        </div>
    </div>
</Demo>

## Size <Badge type="info">class</Badge>

Changing the size mainly changes the font-size and adjusts padding accordingly. It can be specified through a class. Possible class values for sizes are

- `sm`
- `lg`

```vue
<Btn class="sm" label="Small"/>
<Btn label="Default"/>
<Btn class="lg" label="Large"/>
```
<Demo>
    <Btn class="sm" label="Small"/>
    <Btn label="Default"/>
    <Btn class="lg" label="Large"/>
</Demo>

### Spacing <Badge type="info">class</Badge>

Spacing refers to a `Btn`'s default padding and gap (for a given size). Changing spacing to give a more compact or more spacious look can be achieved through one of the following classes:

- `compact`
- `expanded`

```vue
<Btn class="sm compact" label="Compact"/>
<Btn class="sm" label="Default"/>
<Btn class="sm expanded" label="Expanded"/>

<Btn class="compact" label="Compact"/>
<Btn label="Default"/>
<Btn class="expanded" label="Expanded"/>

<Btn class="lg compact" label="Compact"/>
<Btn class="lg" label="Default"/>
<Btn class="lg expanded" label="Expanded"/>
```

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn class="sm compact" label="Compact"/>
            <Btn class="sm" label="Default"/>
            <Btn class="sm expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn class="compact" label="Compact"/>
            <Btn label="Default"/>
            <Btn class="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn class="lg compact" label="Compact"/>
            <Btn class="lg" label="Default"/>
            <Btn class="lg expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

## States

### Disabled <Badge type="info"><pre>disabled</pre> attribute</Badge>

<Demo>
    <Btn disabled label="Disabled"/>
    <Btn class="primary" disabled label="Disabled"/>
    <Btn class="secondary" disabled label="Disabled"/>
    <Btn class="outlined" disabled label="Disabled"/>
    <Btn class="text" disabled label="Disabled"/>
</Demo>

### Loading <Badge type="info"><pre>loading</pre> prop</Badge>

```vue
<Btn loading label="Loading..."/>
```

<Demo>
    <Btn label="Loading" loading/>
    <Btn label="Loading" class="primary" loading/>
    <Btn label="Loading" class="secondary" loading/>
    <Btn label="Loading" class="outlined" loading/>
    <Btn label="Loading" class="text" loading/>
</Demo>

<Demo>
    <div class="row center">
        <Btn label="Loading" class="ok" loading/>
        <Btn label="Loading" class="ok primary" loading/>
        <Btn label="Loading" class="ok secondary" loading/>
        <Btn label="Loading" class="ok outlined" loading/>
        <Btn label="Loading" class="ok text" loading/>
    </div>
    <div class="row center">
        <Btn label="Loading" class="info" loading/>
        <Btn label="Loading" class="info primary" loading/>
        <Btn label="Loading" class="info secondary" loading/>
        <Btn label="Loading" class="info outlined" loading/>
        <Btn label="Loading" class="info text" loading/>
    </div>
    <div class="row center">
        <Btn label="Loading" class="warn" loading/>
        <Btn label="Loading" class="warn primary" loading/>
        <Btn label="Loading" class="warn secondary" loading/>
        <Btn label="Loading" class="warn outlined" loading/>
        <Btn label="Loading" class="warn text" loading/>
    </div>
    <div class="row center">
        <Btn label="Loading" class="danger" loading/>
        <Btn label="Loading" class="danger primary" loading/>
        <Btn label="Loading" class="danger secondary" loading/>
        <Btn label="Loading" class="danger outlined" loading/>
        <Btn label="Loading" class="danger text" loading/>
    </div>
    <div class="row center">
        <Btn label="Loading" class="gray" loading/>
        <Btn label="Loading" class="gray primary" loading/>
        <Btn label="Loading" class="gray secondary" loading/>
        <Btn label="Loading" class="gray outlined" loading/>
        <Btn label="Loading" class="gray text" loading/>
    </div>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Loading" loading class="sm compact"/>
            <Btn label="Loading" loading class="sm"/>
            <Btn label="Loading" loading class="sm expanded"/>
        </div>
        <div class="row center">
            <Btn label="Loading" loading class="compact"/>
            <Btn label="Loading" loading/>
            <Btn label="Loading" loading class="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Loading" loading class="lg compact"/>
            <Btn label="Loading" loading class="lg"/>
            <Btn label="Loading" loading class="lg expanded"/>
        </div>
    </div>
</Demo>

## Icons

### Icon Only <Badge type="info"><pre>icon</pre> prop</Badge>

```vue
<Btn icon="rocket_launch"/>
```

<Demo>
    <Btn icon="rocket_launch"/>
    <Btn icon="rocket_launch" class="primary"/>
    <Btn icon="rocket_launch" class="secondary"/>
    <Btn icon="rocket_launch" class="outlined"/>
    <Btn icon="rocket_launch" class="text"/>
</Demo>

<Demo>
    <div class="row center">
        <Btn icon="rocket_launch" class="ok"/>
        <Btn icon="rocket_launch" class="ok primary"/>
        <Btn icon="rocket_launch" class="ok secondary"/>
        <Btn icon="rocket_launch" class="ok outlined"/>
        <Btn icon="rocket_launch" class="ok text"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" class="info"/>
        <Btn icon="rocket_launch" class="info primary"/>
        <Btn icon="rocket_launch" class="info secondary"/>
        <Btn icon="rocket_launch" class="info outlined"/>
        <Btn icon="rocket_launch" class="info text"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" class="warn"/>
        <Btn icon="rocket_launch" class="warn primary"/>
        <Btn icon="rocket_launch" class="warn secondary"/>
        <Btn icon="rocket_launch" class="warn outlined"/>
        <Btn icon="rocket_launch" class="warn text"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" class="danger"/>
        <Btn icon="rocket_launch" class="danger primary"/>
        <Btn icon="rocket_launch" class="danger secondary"/>
        <Btn icon="rocket_launch" class="danger outlined"/>
        <Btn icon="rocket_launch" class="danger text"/>
    </div>
    <div class="row center">
        <Btn icon="rocket_launch" class="gray"/>
        <Btn icon="rocket_launch" class="gray primary"/>
        <Btn icon="rocket_launch" class="gray secondary"/>
        <Btn icon="rocket_launch" class="gray outlined"/>
        <Btn icon="rocket_launch" class="gray text"/>
    </div>
</Demo>

#### Squared <Badge type="info"><pre>squared</pre> class</Badge>

The `squared` class sets a single padding for all `Btn` sides, giving it a squared aspect when used with only an icon.

```vue
<Btn icon="rocket" class="squared"/>
```

<Demo>
    <Btn icon="rocket" class="squared"/>
    <Btn icon="rocket" class="squared primary"/>
    <Btn icon="rocket" class="squared secondary"/>
    <Btn icon="rocket" class="squared outlined"/>
    <Btn icon="rocket" class="squared text"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn icon="rocket" class="outlined squared sm compact"/>
            <Btn icon="rocket" class="outlined squared sm"/>
            <Btn icon="rocket" class="outlined squared sm expanded"/>
        </div>
        <div class="row center">
            <Btn icon="rocket" class="text squared compact"/>
            <Btn icon="rocket" class="text squared"/>
            <Btn icon="rocket" class="text squared expanded"/>
        </div>
        <div class="row center">
            <Btn icon="rocket" class="secondary squared lg compact"/>
            <Btn icon="rocket" class="secondary squared lg"/>
            <Btn icon="rocket" class="secondary squared lg expanded"/>
        </div>
    </div>
</Demo>


### Icon Left <Badge type="info"><pre>icon-left</pre> prop</Badge>

```vue
<Btn label="Function" icon-left="function"/>
// or
<Btn label="Function" icon="function"/>
```

<Demo>
    <Btn label="Function" icon-left="function"/>
    <Btn label="Function" icon-left="function" class="primary"/>
    <Btn label="Function" icon-left="function" class="secondary"/>
    <Btn label="Function" icon-left="function" class="outlined"/>
    <Btn label="Function" icon-left="function" class="text"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Function" icon-left="function" class="sm compact"/>
            <Btn label="Function" icon-left="function" class="sm"/>
            <Btn label="Function" icon-left="function" class="sm expanded"/>
        </div>
        <div class="row center">
            <Btn label="Function" icon-left="function" class="compact"/>
            <Btn label="Function" icon-left="function"/>
            <Btn label="Function" icon-left="function" class="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Function" icon-left="function" class="lg compact"/>
            <Btn label="Function" icon-left="function" class="lg"/>
            <Btn label="Function" icon-left="function" class="lg expanded"/>
        </div>
    </div>
</Demo>

### Icon Right <Badge type="info"><pre>icon-right</pre> prop</Badge>

```vue
<Btn label="Omega" icon-right="special_character"/>
```

<Demo>
    <Btn label="Omega" icon-right="special_character"/>
    <Btn label="Omega" icon-right="special_character" class="primary"/>
    <Btn label="Omega" icon-right="special_character" class="secondary"/>
    <Btn label="Omega" icon-right="special_character" class="outlined"/>
    <Btn label="Omega" icon-right="special_character" class="text"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" class="sm compact"/>
            <Btn label="Omega" icon-right="special_character" class="sm"/>
            <Btn label="Omega" icon-right="special_character" class="sm expanded"/>
        </div>
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" class="compact"/>
            <Btn label="Omega" icon-right="special_character"/>
            <Btn label="Omega" icon-right="special_character" class="expanded"/>
        </div>
        <div class="row center">
            <Btn label="Omega" icon-right="special_character" class="lg compact"/>
            <Btn label="Omega" icon-right="special_character" class="lg"/>
            <Btn label="Omega" icon-right="special_character" class="lg expanded"/>
        </div>
    </div>
</Demo>