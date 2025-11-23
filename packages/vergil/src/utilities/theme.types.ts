import { themes } from "#utilities"

type Themes = typeof themes
export type Theme = keyof Themes
export type ThemeAlias = Theme | Exclude<Themes[keyof Themes], null>[number]

export type InferTheme<T extends string> = {
	[key in keyof Themes]: T extends key
		? key
		: Themes[key] extends readonly string[]
			? T extends Themes[key][number]
				? key
				: never
			: never
}[keyof Themes]

export type ColorPalette = 'cobalt' | 'dartmouth' | 'denim' | 'emerald' | 'grey' | 'indigo' | 'moss' | 'red' | 'sky' | 'teal' | 'wine' | 'yellow'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full'
export type Spacing = '' | 'compact' | 'expanded'