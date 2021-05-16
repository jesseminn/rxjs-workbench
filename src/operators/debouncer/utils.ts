import { DebounceType, Fn } from './types';

// Inspired by classic debounce function implementation
// Very clever!!
// https://davidwalsh.name/javascript-debounce-function
export const debounce = (debounceType: DebounceType, duration: number, fn: Fn) => {
    const callImmediately = [DebounceType.After, DebounceType.Between].includes(debounceType);
    let id: ReturnType<typeof setTimeout> | null = null;
    let count = 0;

    return (...args: any[]) => {
        count += 1;
        const callNow = callImmediately && id === null;

        if (typeof id === 'number') {
            clearTimeout(id);
        }

        id = setTimeout(() => {
            id = null;

            if ((debounceType === DebounceType.Between && count > 1) || debounceType === DebounceType.Before) {
                fn(...args);
            }

            count = 0;
        }, duration);

        if (callNow) {
            fn(...args);
        }
    };
};

// Derive
export const debounceAfter = (duration: number, fn: Fn) => debounce(DebounceType.After, duration, fn);

export const debounceBefore = (duration: number, fn: Fn) => debounce(DebounceType.Before, duration, fn);

export const debounceBetween = (duration: number, fn: Fn) => debounce(DebounceType.Between, duration, fn);
