---
outline: [2,3]
---

# Btn3D

> Button with 3D effect

<script setup>
    import { Btn3D } from 'vergil/components'
</script>

## Basic Usage

```vue
<script setup>
    import { Btn3D } from 'vergil/components'
</script>

<template>
    <Btn3D>Keep it Clean!</Btn3D>
</template>
```
<Demo>
    <Btn3D>Keep it Clean!</Btn3D>
</Demo>

::: tip
Use the `.btn3d` css selector to target a `Btn3D` component.
:::

### Label <Badge type="info"><pre>label</pre> prop</Badge>

The `Btn3D` label can be specified through the default slot or via a `label` prop. The slot content overrides the `label` prop.

```vue
<Btn3D label="3D Button"/>
```

## Size <Badge type="info">class</Badge>

Changing the size mainly changes the font-size and adjusts padding accordingly. It can be specified through a class. Possible class values for sizes are

- `sm`
- `lg`

```vue
<Btn3D class="sm" label="Small"/>
<Btn3D label="Default"/>
<Btn3D class="lg" label="Large"/>
```
<Demo>
    <Btn3D class="sm" label="Small"/>
    <Btn3D label="Default"/>
    <Btn3D class="lg" label="Large"/>
</Demo>

### Spacing <Badge type="info">class</Badge>

Spacing refers to a `Btn3D`'s default padding and gap (for a given size). Changing spacing to give a more compact or more spacious look can be achieved through one of the following classes:

- `compact`
- `expanded`

```vue
<Btn3D class="sm compact" label="Compact"/>
<Btn3D class="sm" label="Default"/>
<Btn3D class="sm expanded" label="Expanded"/>

<Btn3D class="compact" label="Compact"/>
<Btn3D label="Default"/>
<Btn3D class="expanded" label="Expanded"/>

<Btn3D class="lg compact" label="Compact"/>
<Btn3D class="lg" label="Default"/>
<Btn3D class="lg expanded" label="Expanded"/>
```

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn3D class="sm compact" label="Compact"/>
            <Btn3D class="sm" label="Default"/>
            <Btn3D class="sm expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn3D class="compact" label="Compact"/>
            <Btn3D label="Default"/>
            <Btn3D class="expanded" label="Expanded"/>
        </div>
        <div class="row center">
            <Btn3D class="lg compact" label="Compact"/>
            <Btn3D class="lg" label="Default"/>
            <Btn3D class="lg expanded" label="Expanded"/>
        </div>
    </div>
</Demo>

## States

### Disabled <Badge type="info"><pre>disabled</pre> attribute</Badge>

<Demo>
    <Btn3D disabled label="Disabled"/>
</Demo>

### Loading <Badge type="info"><pre>loading</pre> prop</Badge>

```vue
<Btn3D loading label="Loading..."/>
```

<Demo>
    <Btn3D label="Loading..." loading/>
</Demo>

## Icons

### Icon Only <Badge type="info"><pre>icon</pre> prop</Badge>

```vue
<Btn3D icon="rocket_launch"/>
```

<Demo>
    <Btn3D icon="rocket_launch"/>
</Demo>

#### Squared <Badge type="info"><pre>squared</pre> class</Badge>

The `squared` class sets a single padding for all `Btn3D` sides, giving it a squared aspect when used with only an icon.

```vue
<Btn3D icon="rocket" class="squared"/>
```

<Demo>
    <Btn3D icon="rocket" class="squared"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn3D icon="rocket" class="squared sm compact"/>
            <Btn3D icon="rocket" class="squared sm"/>
            <Btn3D icon="rocket" class="squared sm expanded"/>
        </div>
        <div class="row center">
            <Btn3D icon="rocket" class="squared compact"/>
            <Btn3D icon="rocket" class="squared"/>
            <Btn3D icon="rocket" class="squared expanded"/>
        </div>
        <div class="row center">
            <Btn3D icon="rocket" class="squared lg compact"/>
            <Btn3D icon="rocket" class="squared lg"/>
            <Btn3D icon="rocket" class="squared lg expanded"/>
        </div>
    </div>
</Demo>


### Icon Left <Badge type="info"><pre>icon-left</pre> prop</Badge>

```vue
<Btn3D label="Function" icon-left="function"/>
// or
<Btn3D label="Function" icon="function"/>
```

<Demo>
    <Btn3D label="Function" icon-left="function"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn3D label="Function" icon-left="function" class="sm compact"/>
            <Btn3D label="Function" icon-left="function" class="sm"/>
            <Btn3D label="Function" icon-left="function" class="sm expanded"/>
        </div>
        <div class="row center">
            <Btn3D label="Function" icon-left="function" class="compact"/>
            <Btn3D label="Function" icon-left="function"/>
            <Btn3D label="Function" icon-left="function" class="expanded"/>
        </div>
        <div class="row center">
            <Btn3D label="Function" icon-left="function" class="lg compact"/>
            <Btn3D label="Function" icon-left="function" class="lg"/>
            <Btn3D label="Function" icon-left="function" class="lg expanded"/>
        </div>
    </div>
</Demo>

### Icon Right <Badge type="info"><pre>icon-right</pre> prop</Badge>

```vue
<Btn3D label="Omega" icon-right="special_character"/>
```

<Demo>
    <Btn3D label="Omega" icon-right="special_character"/>
</Demo>

<Demo>
    <div class="col center">
        <div class="row center">
            <Btn3D label="Omega" icon-right="special_character" class="sm compact"/>
            <Btn3D label="Omega" icon-right="special_character" class="sm"/>
            <Btn3D label="Omega" icon-right="special_character" class="sm expanded"/>
        </div>
        <div class="row center">
            <Btn3D label="Omega" icon-right="special_character" class="compact"/>
            <Btn3D label="Omega" icon-right="special_character"/>
            <Btn3D label="Omega" icon-right="special_character" class="expanded"/>
        </div>
        <div class="row center">
            <Btn3D label="Omega" icon-right="special_character" class="lg compact"/>
            <Btn3D label="Omega" icon-right="special_character" class="lg"/>
            <Btn3D label="Omega" icon-right="special_character" class="lg expanded"/>
        </div>
    </div>
</Demo>