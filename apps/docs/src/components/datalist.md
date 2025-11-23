---
outline: [2,3]
---

# Data List

> Component to display list of data.

<script setup>
import { DataList, Btn } from '@vrgl/vergil/components'
</script>

## Basic Usage

<Demo>
    <DataList :data="{
		'Service Number': '((S-117))',
		'Rank': 'Master Chief Petty Officer',
		'Class': 'SPARTAN-II',
		'Operations': [
			['Name', 'Location'],
			['TALON', 'Eridanus Secundus'],
			['PHALANX', 'Circinius IV'],
			['SWITCHBACK', '[REDACTED]'],
			['HORIZON', 'Cascade'],
			['WARM BLANKET', 'Ascon'],
			['IRON FIST', 'Miridem'],
			['OCEAN BREAKER', 'Sigma Octanus IV'],
			['FIRST STRIKE', 'Tau Ceti'],
		]
	}"/>
</Demo>

```vue
<script setup>
import { DataList } from '@8ctavio/vergil/components'
</script>

<template>
    <DataList :data="{
		'Service Number': '((S-117))',
		'Rank': 'Master Chief Petty Officer',
		'Class': 'SPARTAN-II',
		'Operations': [
			['Name', 'Location'],
			['TALON', 'Eridanus Secundus'],
			['PHALANX', 'Circinius IV'],
			['SWITCHBACK', '[REDACTED]'],
			['HORIZON', 'Cascade'],
			['WARM BLANKET', 'Ascon'],
			['IRON FIST', 'Miridem'],
			['OCEAN BREAKER', 'Sigma Octanus IV'],
			['FIRST STRIKE', 'Tau Ceti'],
		]
	}"/>
</template>
```

## Props

### Data <Badge><pre>data: Record<string, string | string[][]></pre></Badge> <Badge><pre>[MiniMarkup](/mini-markup)</pre></Badge>

The `data` object key-value pairs are displayed as the `DataList` labels and values. Badges and simple tables can also be displayed.

String `data` values can be displayed as badges if wrapped with the following Markdown-like tags: `[[<value>]]` or `((<value>))`. The latter form displays the badge with `radius="full"`.

To display a table, a `data` property must be an array of string arrays (`string[][]`). Each string array represents a table row while each string array item represents a table cell.

## API Reference

### Props

| prop | type | default |
| ---- | ---- | ------- |
| `data` | `Record<string, string \| string[][]>` | |
| `descendant` | `boolean` | |
| [`theme`](/theme#the-theme-prop) | `'brand' \| 'user' \| 'ok' \| 'info' \| 'warn' \| 'danger' \| 'neutral'` | `'brand'` |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` |
| `spacing` | `'' \| 'compact' \| 'extended'` | `''` |

### Configuration options

`Datalist`'s [configuration options](/configuration) allow to overwrite some `Datalist` props' default values and may be overwritten under the `datalist` root-level configuration option.

| `datalist.<option>` | type | default | [global](/configuration#global-configuration-options) |
| ------------------- | ---- | ------- | :------: |
| `theme` | [`theme`](/theme#the-theme-prop) | | ✅ |
| `size` | [`size`](/theme#the-size-prop) | | ✅ |
| `radius` | [`radius`](/theme#the-radius-prop) | | ✅ |
| `spacing` | [`spacing`](/theme#the-spacing-prop) | | ✅ |

## Anatomy

<Demo>
    <Anatomy tag="div" classes="data-list">
		<Anatomy tag='template v-for="(value,key) in data"'>
	        <Anatomy tag="label" classes="data-list-label"/>
	        <Anatomy tag="p" classes="data-list-value"/>
	        <Anatomy tag="Badge" classes="badge"/>
			 <Anatomy tag="div" classes="data-list-table">
				<Anatomy tag='template v-for="row of rows"'>
					<Anatomy tag="div" classes="data-list-table-row data-list-table-head">
						<Anatomy tag='p v-for="cell of row"'/>
					</Anatomy>
					<Anatomy tag="div" classes="data-list-table-row">
						<Anatomy tag='p v-for="cell of row"'/>
					</Anatomy>
				</Anatomy>
			</Anatomy>
		</Anatomy>
    </Anatomy>
</Demo>