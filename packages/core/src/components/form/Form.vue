<script lang="ts">
import { h, mergeProps } from 'vue'
import { ModelGroupImpl } from '#composables'
import { ucFirst } from '#utilities'
import type { PropType, ExtractPropTypes, VNode } from 'vue'
import type { ModelGroupPayload } from '#types'

type Props = ExtractPropTypes<typeof propsDefinition>

const propsDefinition = {
	fields: {
		type: ModelGroupImpl as PropType<ModelGroupImpl>,
		required: true as const
	},
	validationCooldown: {
		type: Number,
		default: () => vergil.config.form.validationCooldown ?? vergil.config.global.validationCooldown,
	},
	showErrors: [Boolean, Array] as PropType<boolean | string[]>,
	badgeProps: Object
}

function Errors(props: Props) {
	const { showErrors } = props
	if (showErrors) {
		let filter: Parameters<ModelGroupImpl['forErrors']>[1]
		if (Array.isArray(showErrors)) {
			const fieldPaths = [...showErrors]
			filter = (actions, path, isGroup) => {
				if (isGroup) {
					const subPath = path + '.'
					for (let i=0; i<fieldPaths.length; i++) {
						if (fieldPaths[i]!.startsWith(subPath)) {
							const wildcard = fieldPaths[i]!.slice(subPath.length, subPath.length + 3)
							if (wildcard === '*') {
								pull(fieldPaths, i)
								return actions.ACCEPT_CHILDREN
							} else if (wildcard === '**') {
								pull(fieldPaths, i)
								return actions.ACCEPT_DESCENDANTS
							} else {
								return actions.ACCEPT
							}
						}
					}
				} else {
					for (let i=0; i<fieldPaths.length; i++) {
						if (path === fieldPaths[i]) {
							pull(fieldPaths, i)
							return actions.ACCEPT
						}
					}
				}
				return actions.SKIP
			}
		}

		const fieldErrors: VNode[] = []
		props.fields.forErrors((errors, field) => {
			fieldErrors.push(h('div', { class: 'form-error-field' }, [
				// @ts-expect-error
				h('b', { class: 'form-error-field-name' }, errors._formLabel ?? ucFirst(field)),
				errors.length === 1
					? h('p', { class: 'form-error-message' }, errors[0])
					: h('ul', { class: 'form-error-message' }, errors.map(error => h('li', error)))
			]))
		}, filter)
		
		if (fieldErrors.length > 0) {
			return h(
				Badge,
				mergeProps({
					class: 'form-errors',
					theme: 'danger',
					outline: 'subtle',
				}, props.badgeProps ?? {}),
				() => fieldErrors 
			)
		}
	}
	return null
}
</script>

<script setup lang="ts">
import { vergil } from '#vergil'
import { Badge } from '#components'
import { debounce, pull } from '#utilities'

const props = defineProps(propsDefinition)
const emit = defineEmits<{
	submit: [Event, ModelGroupPayload];
	invalid: [Event, ModelGroupPayload]
}>()

const validate = (event: Event) => {
	const [isValid, payload] = props.fields.validate(true)
	// @ts-expect-error
	emit(isValid ? 'submit' : 'invalid', event, payload)
}
const handleValidation = props.validationCooldown > 0
	? debounce(validate, props.validationCooldown, { eager: true })
	: validate

function handleSubmit(event: Event) {
	event.preventDefault()
	handleValidation(event)
}
</script>

<template>
	<form class="form" @submit="handleSubmit">
		<div class="form-fields">
			<slot/>
		</div>
		<Errors v-bind="props"/>
		<slot name="submit"/>
	</form>
</template>

<style>
.form {
	display: flex;
	flex-direction: column;
	row-gap: 15px;

	& > .form-errors {
		display: flex;
		flex-direction: column;
		row-gap: var(--g-gap-2xl);
		padding: var(--g-gap-2xl) var(--g-gap-xl);

		& ::selection{
            background-color: var(--c-theme-soft-4);
        }
		& > .form-error-field {
			font-size: 0.9em;
			display: flex;
			flex-direction: column;
			flex-shrink: 1;
			row-gap: var(--g-gap-xl);

			& > .form-error-field-name {
				padding: 0 var(--g-gap-sm) var(--g-gap-xs);
				border-bottom: 1px solid var(--c-theme-border-subtle);
			}
			& > p.form-error-message {
				padding: 0 var(--g-gap-sm);
			}
			& > ul.form-error-message {
				margin: 0;
				padding-left: var(--g-gap-3xl);
				& > li:nth-child(n + 2) {
					margin-top: var(--g-gap-sm);
				}
			}
		}
	}
}
</style>