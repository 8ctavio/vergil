<script lang="ts">
import { h, mergeProps } from 'vue'
import { ModelGroupImpl } from '#composables'
import { ucFirst } from '#utilities'
import type { VNode } from 'vue'
import type { ModelGroup, ModelGroupFields, Exposed } from '#composables'

interface Props<F extends ModelGroupFields> {
	fields: ModelGroup<F>
	validationCooldown?: number
	showErrors?: boolean | string[]
	badgeProps?: Record<string, unknown>
	exposed?: Exposed
}

function Errors<F extends ModelGroupFields>(props: Props<F>) {
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

<script setup lang="ts" generic="F extends ModelGroupFields">
import { shallowRef } from 'vue'
import { vergil } from '#vergil'
import { Badge } from '#components'
import { useDefineExposed } from '#composables'
import { watchControlledSync } from '#reactivity'
import { debounce, pull } from '#utilities'
import type { ShallowRef } from 'vue'
import type { ModelGroupPayload } from '#composables'

const props = withDefaults(defineProps<Props<F>>(), {
	validationCooldown: () => vergil.config.form.validationCooldown ?? vergil.config.global.validationCooldown
})
const emit = defineEmits<{
	submit: [SubmitEvent, ModelGroupPayload<F>];
	invalid: [SubmitEvent, ModelGroupPayload<F>]
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

let formError: ShallowRef<string>
if (props.exposed) {
	formError = shallowRef('')
	const errorWatcher = watchControlledSync(formError, () => {
		errorWatcher.pause()
		fieldsWatcher.resume()
	})

	const { fields } = props
	const fieldsWatcher = watchControlledSync(Object.keys(fields).map(field => fields[field as keyof typeof fields].ref), () => {
		fieldsWatcher.pause()
		formError.value = ''
		errorWatcher.resume()
	})
	fieldsWatcher.pause()
	
	useDefineExposed({
		setFormError(error: string = '') {
			formError.value = error
		}
	})
}
</script>

<template>
	<form class="form" @submit="handleSubmit">
		<div class="form-fields">
			<slot/>
		</div>
		<Badge v-if="formError" class="form-errors" theme="danger" outline="subtle" v-bind="badgeProps">
			<p class="form-error-message">{{ formError }}</p>
		</Badge>
		<Errors v-else v-bind="props"/>
		<slot name="submit" :formError="Boolean(formError)"/>
	</form>
</template>

<style>
.form {
	display: flex;
	flex-direction: column;
	row-gap: 15px;

	& > .form-errors {
		font-size: calc(0.9 * var(--font-size));
		display: flex;
		flex-direction: column;
		row-gap: var(--g-gap-2xl);
		padding: var(--g-gap-2xl) var(--g-gap-xl);
		
		& ::selection{
			background-color: var(--c-theme-soft-4);
        }
		& p.form-error-message {
			padding: 0 var(--g-gap-sm);
		}
		& > .form-error-field {
			display: flex;
			flex-direction: column;
			flex-shrink: 1;
			row-gap: var(--g-gap-xl);

			& > .form-error-field-name {
				padding: 0 var(--g-gap-sm) var(--g-gap-xs);
				border-bottom: 1px solid var(--c-theme-border-subtle);
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