export interface Debounced {
	(this: unknown, ...args: unknown[]): void;
	cancel: () => void;
}