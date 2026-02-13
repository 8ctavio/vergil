import type { WatchOptions } from "vue"

export interface WatchControls {
	stop(): void;
	pause(): void;
	resume(): void;
}

export type WatchControlledOptions<
	Immediate extends boolean = boolean
> = WatchOptions<Immediate> & {
	/**
	 * Whether to execute the scheduled callback
	 * regardless of the watcher's paused state.
	 * @default false
	 */
	nonPreemptive?: boolean
}

export interface WatchControlledHandle extends WatchControls {
	ignore(callback: () => void): void;
}