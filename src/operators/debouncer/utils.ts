import { DebouncerType, Fn } from './types';

// Inspired by classic debounce function implementation
// Very clever!!
// https://davidwalsh.name/javascript-debounce-function
const debouncer = (debounceType: DebouncerType, duration: number, fn: Fn) => {
    const callImmediately = debounceType === DebouncerType.After;
    let id: ReturnType<typeof setTimeout> | null = null;

    return (...args: any[]) => {
        const callNow = callImmediately && id === null;

        typeof id === 'number' && clearTimeout(id);

        id = setTimeout(() => {
            id = null;

            // The first possible place to call the function
            !callImmediately && fn(...args);
        }, duration);

        // The second possible place to call the function
        callNow && fn(...args);
    };
};

// Derive
export const afterDebouncer = (duration: number, fn: Fn) => debouncer(DebouncerType.After, duration, fn);

export const beforeDebouncer = (duration: number, fn: Fn) => debouncer(DebouncerType.Before, duration, fn);
