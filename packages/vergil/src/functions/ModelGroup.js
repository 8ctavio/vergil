import { ModelGroupImpl } from "#functions"

/**
 * @import { ModelGroupConstructor, ModelGroupInstance, ModelGroupFields } from "#functions"
 */

/**
 * @template { ModelGroupFields } [F = ModelGroupFields]
 * @typedef { ModelGroupInstance<F> } ModelGroup
 */

/** @type { ModelGroupConstructor } */
export const ModelGroup = /** @type {any} */(ModelGroupImpl)