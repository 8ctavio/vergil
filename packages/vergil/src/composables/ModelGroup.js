import { ModelGroupImpl } from "#composables/.private/ModelGroupImpl"

/**
 * @import { ModelGroupFields, ModelGroupConstructor, ModelGroupInstance } from "#composables"
 */

/**
 * @template { ModelGroupFields } [F = ModelGroupFields]
 * @typedef { ModelGroupInstance<F> } ModelGroup
 */

/** @type { ModelGroupConstructor } */
export const ModelGroup = /** @type {any} */(ModelGroupImpl)