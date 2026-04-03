import { createRoot, onCleanup } from 'solid-js';

interface IEventEmitter {
	type: string;
	data?: any;
}

class EventEmitter<T> {
	private subscriptions: Set<(val: T) => void>;

	constructor() {
		this.subscriptions = new Set();
	}

	emit = (val: T): void => {
		for (const subscription of this.subscriptions) {
			subscription(val);
		}
	};

	subscribe = (callback: (val: T) => void): (() => void) => {
		this.subscriptions.add(callback);

		// Return unsubscribe function
		return () => {
			this.subscriptions.delete(callback);
		};
	};

	// SolidJS hook for automatic cleanup
	useSubscription = (callback: (val: T) => void): void => {
		const unsubscribe = this.subscribe(callback);
		onCleanup(unsubscribe);
	};
}

// Alternative: Global instance approach (as you started)
export const createGlobalEventEmitter = () => {
	return createRoot(() => {
		const eventEmitter = new EventEmitter<IEventEmitter>();
		return {
			emit: eventEmitter.emit,
			subscribe: eventEmitter.subscribe,
			useSubscription: eventEmitter.useSubscription,
		};
	});
};

// Create global instance
export const listener = createGlobalEventEmitter();
