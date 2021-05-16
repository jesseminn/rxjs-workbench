import { timer, Observable, MonoTypeOperatorFunction, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { DebounceType } from './types';

// Follows the pattern of debounceFn
export const debouncer = <T>(
    debouncerType: DebounceType,
    durationSelector: (v: T) => Observable<unknown>,
): MonoTypeOperatorFunction<T> => {
    const emitImmediately = debouncerType === DebounceType.After;
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
    debouncer(DebounceType.After, durationSelector);

export const afterDebouncerTime = (duration: number) => afterDebouncer(() => timer(duration));

export const beforeDebouncer = <T>(durationSelector: (v: T) => Observable<unknown>) =>
    debouncer(DebounceType.Before, durationSelector);

export const beforeDebouncerTime = (duration: number) => beforeDebouncer(() => timer(duration));
