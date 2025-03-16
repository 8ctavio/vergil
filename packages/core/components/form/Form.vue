<script setup>
import { Badge } from '..'
import { computed, h, mergeProps } from 'vue'
import { ModelGroup } from '../../functions'
import { ucFirst } from '../../utilities'
import { pull } from '../../utilities/private'

const props = defineProps({
	fields: ModelGroup,
	showErrors: [Boolean, Array],
	badgeProps: Object
})
const emit = defineEmits(['submit', 'error'])

const error = computed(() => props.fields.error)

function handleSubmit(event) {
	event.preventDefault()
	if(props.fields.validate()) {
		emit('submit', event, props.fields.getPayload())
	} else {
		emit('error', event)
	}
}

function Errors() {
	const { showErrors } = props
	if(showErrors) {
		let filter
		if(Array.isArray(showErrors)) {
			const fieldPaths = [...showErrors]
			filter = (path, isGroup, actions) => {
				if(isGroup) {
					const subPath = path + '.'
					for(let i=0; i<fieldPaths.length; i++) {
						if(fieldPaths[i].startsWith(subPath)) {
							const wildcard = fieldPaths[i].slice(subPath.length, subPath.length + 3)
							if(wildcard === '*') {
								pull(fieldPaths, i)
								return actions.ACCEPT_CHILDREN
							} else if(wildcard === '**') {
								pull(fieldPaths, i)
								return actions.ACCEPT_DESCENDANTS
							} else {
								return actions.ACCEPT
							}
						}
					}
				} else {
					for(let i=0; i<fieldPaths.length; i++) {
						if(path === fieldPaths[i]) {
							pull(fieldPaths, i)
							return actions.ACCEPT
						}
					}
				}
				return actions.SKIP
			}
		}

		const fieldErrors = []
		props.fields.forErrors((errors, field) => {
			fieldErrors.push(h('div', { class: 'form-error-field' }, [
				h('b', { class: 'form-error-field-name' }, errors._formLabel ?? ucFirst(field)),
				errors.length === 1
					? h('p', { class: 'form-error-message' }, errors[0])
					: h('ul', { class: 'form-error-message' }, errors.map(error => h('li', error)))
			]))
		}, filter)
		
		if(fieldErrors.length > 0) {
			return h(
				Badge,
				mergeProps({
					class: 'form-errors',
					theme: 'danger',
					outline: 'subtle',
				}, props.badgeProps),
				() => fieldErrors 
			)
		}
	}
	return null
}
</script>

<template>
	<form class="form" @submit="handleSubmit">
		<div class="form-fields">
			<slot/>
		</div>
		<Errors/>
		<slot name="submit" :error/>
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