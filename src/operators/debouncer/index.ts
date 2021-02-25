import { timer, Observable, MonoTypeOperatorFunction, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DebouncerType } from './types';

// Follows the pattern of debounceFn
export const debouncer = <T>(
    debouncerType: DebouncerType,
    durationSelector: (v: T) => Observable<unknown>,
): MonoTypeOperatorFunction<T> => {
    const emitImmediately = debouncerType === DebouncerType.After;
    let subscription: Subscription | null = null;

    return input$ => {
        return new Observable(subscriber => {
            input$.subscribe({
                next(v) {
                    const emitNow = emitImmediately && !subscription;
                    subscription instanceof Subscription && subscription.unsubscribe();

                    const duration$ = durationSelector(v);
                    subscription = duration$.pipe(first()).subscribe(() => {
                        subscription = null;
                        !emitImmediately && subscriber.next(v);
                    });
                    emitNow && subscriber.next(v);
                },
                error(err) {
                    subscriber.error(err);
                },
                complete() {
                    subscriber.complete();
                },
            });
        });
    };
};

// Derive
export const afterDebouncer = <T>(durationSelector: (v: T) => Observable<unknown>) =>
    debouncer(DebouncerType.After, durationSelector);

export const afterDebouncerTime = (duration: number) => afterDebouncer(() => timer(duration));

export const beforeDebouncer = <T>(durationSelector: (v: T) => Observable<unknown>) =>
    debouncer(DebouncerType.Before, durationSelector);

export const beforeDebouncerTime = (duration: number) => beforeDebouncer(() => timer(duration));
