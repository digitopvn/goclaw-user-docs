// src/hooks/useInterval.ts
import { from, createSignal, onCleanup } from 'solid-js';

/**
 * SolidJS hook for creating a managed interval that executes a callback function
 *
 * @param callback Function to execute on each interval
 * @param delayMs Delay in milliseconds between executions
 * @param immediate Whether to execute the callback immediately upon starting (default: false)
 * @param autoStart Whether to start the interval on hook initialization (default: true)
 * @returns Object with controls for the interval
 */
export function useInterval<T>(
	callback: () => void,
	delayMs: number,
	immediate: boolean = false,
	autoStart: boolean = true
) {
	const [isRunning, setIsRunning] = createSignal(autoStart);
	const [count, setCount] = createSignal(0);
	let intervalId: number | undefined;

	// Reactive signal that manages the interval
	from<number>((set) => {
		// If autoStart is true, start the interval immediately
		if (autoStart) {
			// Execute immediately if requested
			if (immediate) {
				callback();
				set((c) => c && c + 1); // Increment count to trigger reactivity
			}

			intervalId = window.setInterval(() => {
				callback();
				set((c) => c && c + 1); // Increment count to trigger reactivity
				setCount((c) => c + 1); // Also update the public count
			}, delayMs);
		}

		// Return cleanup function
		return () => {
			if (intervalId !== undefined) {
				clearInterval(intervalId);
				intervalId = undefined;
			}
		};
	});

	// Start the interval
	const start = () => {
		if (!isRunning()) {
			setIsRunning(true);

			// Execute immediately if requested
			if (immediate) {
				callback();
				setCount((c) => c + 1);
			}

			intervalId = window.setInterval(() => {
				callback();
				setCount((c) => c + 1);
			}, delayMs);
		}
	};

	// Stop the interval
	const stop = () => {
		if (isRunning()) {
			setIsRunning(false);
			if (intervalId !== undefined) {
				clearInterval(intervalId);
				intervalId = undefined;
			}
		}
	};

	// Reset the counter (but keep interval running if it was)
	const reset = () => {
		setCount(0);
	};

	// Toggle the interval
	const toggle = () => {
		isRunning() ? stop() : start();
	};

	// Change the delay (restart interval if running)
	const setDelay = (newDelayMs: number) => {
		const wasRunning = isRunning();

		// Stop current interval
		if (wasRunning) {
			stop();
		}

		// Update delay
		delayMs = newDelayMs;

		// Restart if it was running
		if (wasRunning) {
			start();
		}
	};

	// Clean up the interval when the component is unmounted
	onCleanup(() => {
		if (intervalId !== undefined) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
	});

	return {
		isRunning,
		count,
		start,
		stop,
		reset,
		toggle,
		setDelay,
	};
}

// Example usage:
/*
import { createSignal } from 'solid-js';
import { useInterval } from './hooks/useInterval';

function ClockExample() {
  const [time, setTime] = createSignal(new Date());
  
  // Update the time every second
  const timer = useInterval(
    () => setTime(new Date()),
    1000,
    true // Execute immediately
  );
  
  return (
    <div>
      <div>Current time: {time().toLocaleTimeString()}</div>
      <button onClick={timer.toggle}>
        {timer.isRunning() ? 'Pause Clock' : 'Start Clock'}
      </button>
    </div>
  );
}
*/
