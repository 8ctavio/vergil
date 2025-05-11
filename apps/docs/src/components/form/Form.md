---
outline: [2,3]
---

# Form

:::tip
Before proceeding with `Form`, learn first about the [`ModelGroup`](/functions/ModelGroup) class.
:::

<script setup>
import { Form, InputText, Checkbox, Btn } from '@8ctavio/vergil/components'
import { shallowRef } from 'vue'
import { ModelGroup } from '@8ctavio/vergil'

const form = new ModelGroup({
	username: {
		value: '',
		validator(value, error) {
			if (!value) error('Username required')
		}
	}
})

const loader = shallowRef(false)
async function handleSubmit(event, payload) {
	loader.value = true
	try {
		await new Promise(r => setTimeout(r, 2000))
		form.reset()
	} finally {
		loader.value = false
	}
}

const demo = new ModelGroup({
	check: {
		value: false,
		formLabel: 'Checkbox field',
		validator(value, error) {
			if (!value) error('Must be checked')
		}
	}
})
</script>

<style module>
.form {
	width: 220px;
}
</style>

## Basic Usage

<Demo>
	<Form :fields="form" @submit="handleSubmit" :class="$style.form">
		<InputText v-model="form.username" label="Username" show-errors :disabled="loader"/>
		<template #submit>
			<Btn label="Submit" :loading="loader"/>
		</template>
	</Form>
</Demo>

```vue
<script setup>
import { Form, InputText, Btn } from '@8ctavio/vergil/components'
import { shallowRef } from 'vue'
import { ModelGroup } from '@8ctavio/vergil'

const form = new ModelGroup({
	username: {
		value: '',
		validator(value, error) {
			if (!value) error('Username required')
		}
	}
})

const loader = shallowRef(false)
async function handleSubmit(event, payload) {
	loader.value = true
	try {
		await new Promise(r => setTimeout(r, 2000))
		form.reset()
	} finally {
		loader.value = false
	}
}
</script>

<template>
    <Form :fields="form" @submit="handleSubmit">
		<InputText v-model="form.username" label="Username" show-errors :disabled="loader"/>
		<template #submit>
			<Btn label="Submit" :loading="loader"/>
		</template>
	</Form>
</template>

<style scoped>
.form {
	width: 220px;
}
</style>
```

## Description

The `Form` component is a wrapper for a `form` HTML element, and must receive a `ModelGroup` object instance through its `fields` prop.

Whenever a `Form`'s underlying form element is submitted (i.e., its submit event is fired), that `Form`'s ModelGroup validation is automatically performed with debouncing.

## Props

### Fields <Badge><pre>fields: ModelGroup</pre></Badge> <Badge type="warning"><pre>required</pre></Badge>

An instance of the `ModelGroup` class.

```vue
<script setup>
const form = new ModelGroup({
	field: { /* ... */ }
})
</script>

<template>
    <Form :fields="form">
		<!-- ... -->
	</Form>
</template>
```

### Validation Cooldown <Badge><pre>validation-cooldown: number = 350</pre></Badge>

The `validation-cooldown` prop is the minimum delay in milliseconds to wait before validating a `Form`'s ModelGroup since the form element was last submitted (see [Description](#description)).

### Show errors <Badge><pre>show-errors: boolean | string[]</pre></Badge>

Similar to the [`show-errors`](/components/form/introduction#shared-props) prop of some form field components, a `Form`'s `show-errors` prop allows to display the provided ModelGroup's errors in a [`Badge`](/components/badge) component placed after the form fields and before the submit button (see [Anatomy](#anatomy)).

When `show-errors` is set to `true`, the errors of all ModelGroup's nested models will be displayed. In addition, only errors of specific models may be displayed by passing an array of the ModelGroup's dot-notation path strings to those models.

To illustrate, consider the following ModelGroup.

```js
const form = new ModelGroup({
	foo: { /* ... */ },
	bar: ModelGroup.nested({
		baz: { /* ... */ },
		qux: ModelGroup.nested({ /* ... */ }) 
	})
})
```

In order to display only the errors of the `form.foo` and `form.bar.baz` models, `show-errors` may be set to `['foo', 'bar.baz']`.

Furthermore, a `show-errors` array may also include paths to nested ModelGroups as long as they are suffixed by a *wildcard*. Available wildcards are `'.*'` and `'.**'`, which respectively display all *child* and *descendant* models of a nested ModelGroup. 

Thus, recalling the previous example, the `show-errors` array `['bar.*']` would display the errors of the `form.bar.baz` model. Similarly, besides `form.bar.baz`, the array `['bar.**']` would also include all nested models of the `form.bar.qux` ModelGroup.

Finally, errors are displayed under a heading or label to identify the model (field) they belong to. This label may be customized by providing an special `formLabel` property to a [ModelGroup's model specification object](/functions/ModelGroup#description).

```vue
<script setup>
const form = new ModelGroup({
	check: {
		value: false,
		formLabel: 'Checkbox field',
		validator(value, error) {
			if (!value) error('Must be checked')
		}
	}
})
</script>

<template>
    <Form :fields="form">
		<Checkbox v-model="form.check" label="Check"/>
		<template #submit>
			<Btn label="Submit"/>
		</template>
	</Form>
</template>
```

<Demo>
	<Form :fields="demo" show-errors :class="$style.form">
		<Checkbox v-model="demo.check" label="Check"/>
		<template #submit>
			<Btn label="Submit"/>
		</template>
	</Form>
</Demo>

### Badge props <Badge><pre>badge-props: Record<string, unknown></pre></Badge>

Props for the underlying [`Badge`](/components/badge) component where model errors are displayed.

## Events

After a `Form`'s ModelGroup is [automatically validated](#description), either the `submit` or `invalid` event is emitted depending on the validation result; if no errors are encountered, `submit` is emitted, and `invalid` otherwise. Both events accept two parameters: the submit `event` object and the validated ModelGroup's payload.

### Submit <Badge><pre>onSubmit: (event: Event, payload: ModelGroupPayload) => void</pre></Badge>

```vue
<script setup>
function handleSubmit(event, payload) {
	/* ... */
}
</script>

<template>
    <Form @submit="handleSubmit"/>
</template>
```

### Invalid <Badge><pre>onInvalid: (event: Event, payload: ModelGroupPayload) => void</pre></Badge>

```vue
<script setup>
function onInvalid(event, payload) {
	/* ... */
}
</script>

<template>
    <Form @invalid="onInvalid"/>
</template>
```

## Anatomy

<Demo>
    <Anatomy tag="form" classes="form">
        <Anatomy tag="div" classes="form-fields">
            <Anatomy tag='slot name="default"'/>
        </Anatomy>
        <Anatomy tag="Badge" classes="form-errors"/>
        <Anatomy tag='slot name="submit"'/>
    </Anatomy>
</Demo>

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `fields` | `ModelGroupInstance` | |
| `validationCooldown` | `number` | `350` |
| `showErrors` | `boolean \| string[]` | |
| `badgeProps` | `Record<string, unknown>` | |

### Configuration options

`Form`'s [configuration options](/configuration) allow to overwrite some `Form` props' default values and may be overwritten under the `form` root-level configuration option.

| `form.<option>` | type | default | [global](/configuration#global-configuration-options) |
| --------------- | ---- | ------- | :------: |
| `validationCooldown` | `number` | | ✅ |