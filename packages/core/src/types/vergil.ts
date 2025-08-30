import type { DeepOptional, Theme, ColorPalette, Size, Radius, Spacing, BtnVariant, BtnOutline, ToggleVariant, ToasterPosition, Tuple } from '.'

export type PartialVergilConfig = DeepOptional<VergilConfig>
export interface VergilConfig {
	global: {
		validationDelay: number;
		validationCooldown: number;
		theme: Theme;
		size: Size;
		radius: Radius;
		spacing: Spacing;
		icon: {
			[K in Theme]: string;
		}
	},
	userTheme: {
		enable: boolean;
		default: ColorPalette
	},
	badge: {
		variant: BtnVariant;
		soft: {
			outline?: BtnOutline
		};
		subtle: {
			outline?: BtnOutline
		};
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
		squared?: boolean;
	},
	btn: {
		variant: BtnVariant;
		solid: {
			mask?: 'ghost' | 'form-field';
			outline?: BtnOutline;
			underline?: boolean;
			fill?: boolean;
		};
		soft: {
			mask?: 'ghost' | 'form-field';
			outline?: BtnOutline;
			underline?: boolean;
			fill?: boolean;
		};
		subtle: {
			mask?: 'ghost' | 'form-field';
			outline?: BtnOutline;
			underline?: boolean;
			fill?: boolean;
		};
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
		squared?: boolean;
	},
	btn3D: {
		variant: BtnVariant;
		soft: {
			outline?: BtnOutline;
		};
		subtle: {
			outline?: BtnOutline;
		};
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
		squared?: boolean;
	},
	calendar: {
		locale: Intl.LocalesArgument;
		labels?: {
			months?: Tuple<string, 12>;
			shortMonths?: Tuple<string, 12>;
			shortWeekdays?: Tuple<string, 7>;
		};
		firstWeekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		timeFormat: '12' | '24';
		validationDelay?: number;
		validationCooldown?: number;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	checkbox: {
		variant: ToggleVariant;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	confirm: {
		confirmLabel: string;
		declineLabel: string;
		size?: Size;
		radius?: Radius;
		icon: {
			[K in Theme]?: string;
		}
	},
	datalist: {
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	datePicker: {
		format?: (date: Date) => string;
		formatOptions?: Intl.DateTimeFormatOptions | ((timeEnabled: boolean) => Intl.DateTimeFormatOptions);
		placeholderFallback: (n: number) => string;
		sideButtonPosition: 'before' | 'after';
		underline?: boolean;
		fill?: boolean;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	form: {
		validationCooldown?: number;
	},
	inputNumber: {
		validationDelay?: number;
		validationCooldown?: number;
	},
	inputSearch: {
		btnPosition: 'before' | 'after';
	},
	inputText: {
		underline: boolean;
		validationDelay?: number;
		validationCooldown?: number;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	placeholder: {
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	popover: {
		padding: number;
		delay: number;
	},
	popup: {
		theme?: Theme;
		size?: Size;
		radius?: Radius;
	},
	radio: {
		variant: ToggleVariant;
		radioRadius: Radius;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	select: {
		placeholderFallback: (n: number) => string;
		placeholderNotFound: (query: string) => string;
		placeholderFilter: string;
		underline?: boolean;
		fill?: boolean;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	skeleton: {
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	slider: {
		validationDelay?: number;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	switch: {
		theme?: Theme;
		size?: Size;
		radius: Radius;
		spacing?: Spacing;
	},
	textarea: {
		underline: boolean;
		validationDelay?: number;
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		spacing?: Spacing;
	},
	toast: {
		theme?: Theme;
		size?: Size;
		radius?: Radius;
		icon: {
			[K in Theme]?: string;
		}
	},
	toaster: {
		positions: ToasterPosition[];
		position: ToasterPosition;
		duration: number;
	},
	tooltip: {
		arrow: boolean;
		offset: (arrow: boolean) => number;
		placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'
	}
}