export interface WatchControls {
	stop(): void;
	pause(): void;
	resume(): void;
}

export interface WatchControlledHandle extends WatchControls {
	ignore(callback: () => void): void;
}