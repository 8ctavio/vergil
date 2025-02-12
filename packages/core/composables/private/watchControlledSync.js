import { watch } from 'vue'

export function watchControlledSync(sources, callback, options = {}) {
	let skip = false
	const watcher = watch(sources, (...args) => {
		if(!skip) callback(...args)
	}, { ...options, flush: 'sync' })
	
	return {
		pause: watcher.pause,
		resume() {
			skip = true
			watcher.resume()
			skip = false
		},
		stop: () => watcher()
	}
}