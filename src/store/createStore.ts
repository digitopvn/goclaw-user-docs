// src/store/createStore.ts
import { createRoot, onMount } from 'solid-js';
import { createStore, SetStoreFunction, Store, reconcile } from 'solid-js/store';

// Generic type for the updater function
export type UpdaterFunction<T> = (prev: T) => T;

// Type for the global store
export type GlobalStore<T extends object> = {
	state: Store<T>;
	update: <K extends keyof T>(key: K, value: Partial<T[K]> | ((prev: T[K]) => T[K])) => void;
	replace: (newState: Partial<T>) => void;
	setState: SetStoreFunction<T>;
};

/**
 * Creates a global store that persists across component lifecycles
 * using SolidJS's createRoot
 *
 * @param initialState Initial state for the store
 * @returns An object containing the store state and update methods
 */
export function createGlobalStore<T extends object>(initialState: T): GlobalStore<T> {
	// Using createRoot to ensure our signals persist across component lifecycles
	return createRoot(() => {
		const [state, setState] = createStore<T>(initialState);
		// // Lưu store vào localStorage (mặc định)

		// Helper to update specific parts of the store in a type-safe way
		const update = <K extends keyof T>(key: K, value: Partial<T[K]> | ((prev: T[K]) => T[K])) => {
			if (typeof value === 'function') {
				const updateFn = value as (prev: T[K]) => T[K];
				// Use a simpler approach by directly accessing the property
				setState(key as any, (prev: T[K]) => updateFn(prev));
			} else {
				// Setting the value directly
				setState(key as any, value);
			}
		};

		// Helper to replace parts of the state with a partial object
		const replace = (newState: Partial<T>) => {
			setState(reconcile(newState as T));
		};

		// Return the state and update functions
		return {
			state,
			update,
			replace,
			setState, // Also expose the original setState for more complex updates
		};
	});
}

// Example usage:
/*
// Basic usage
const { state, update, replace, setState } = createGlobalStore({
  user: { name: 'John', age: 30 },
  settings: { theme: 'dark', notifications: true },
  counter: 0
});

// Update a single property
update('counter', 5);

// Update with a function
update('counter', prev => prev + 1);

// Replace multiple properties at once
replace({
  user: { name: 'Jane', age: 28 },
  counter: 10
});

// For nested updates, use the nested store
const nested = createNestedStore({
  user: { 
    name: 'John', 
    preferences: { theme: 'dark', fontSize: 16 }
  },
  items: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]
});

// Update deeply nested property
nested.updateNested(['user', 'preferences', 'theme'], 'light');

// Update array item
nested.updateNested(['items', 0, 'name'], 'Updated Item 1');

// Use function to update
nested.updateNested(['user', 'preferences'], prev => ({
  ...prev,
  fontSize: prev.fontSize + 1
}));

// Merge objects
nested.merge('user', { 
  name: 'Jane',
  email: 'jane@example.com'
});
*/
