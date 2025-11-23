export type DateComponents<UpToMonth extends boolean = false> = UpToMonth extends true
	? [number, number, number?]
	: [number, number, number]