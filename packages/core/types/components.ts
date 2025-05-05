export type BtnVariant = 'solid' | 'soft' | 'subtle'
export type BtnOutline = boolean | 'regular' | 'subtle' | 'strong';

export type ToggleVariant = 'classic' | 'card' | 'list' | 'toggle';

export type ToasterPosition = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';

export type SelectionOptions = (string | [string, string])[] | Record<string, string | [string, string]>
export type SelectionOptionProperty = string | ((option: unknown, key: string | number) => string)