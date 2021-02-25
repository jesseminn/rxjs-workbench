import { defer, MonoTypeOperatorFunction, Observable, OperatorFunction } from 'rxjs';
import { finalize, map, scan, share } from 'rxjs/operators';

// Types
import { Interval, Options } from './types';

// Utils
import { fillOptions } from './utils';

export const emissionInterval = <T>(length = 10): OperatorFunction<T, number[]> => (source$: Observable<T>) => {
    return source$.pipe(
        scan<T, Interval>(acc => {
            acc.unshift(Date.now());
            const sliced = acc.slice(0, length + 1);
            return sliced;
        }, []),
        map(acc => {
            const interval = acc.reduce((acc, cur, i, thisArg) => {
                if (thisArg.length < 2) {
                    return [];
                }
                if (i < thisArg.length - 1) {
                    const interval = cur - thisArg[i + 1];
                    acc[i] = interval;
                }
                return acc;
            }, [] as number[]);
            return interval;
        }),
    );
};

export const emissionIntervalLog = <T>(options: Options = {}): MonoTypeOperatorFunction<T> => (
    source$: Observable<T>,
) => {
    // prevent additional subscription to the source$
    const sharedSource$ = source$.pipe(share());
    const { length, label, formatter } = fillOptions(options);

    return defer(() => {
        const subscription = sharedSource$.pipe(emissionInterval(length)).subscribe(interval => {
            console.log(label, formatter(interval));
        });

        return sharedSource$.pipe(
            finalize(() => {
                subscription.unsubscribe();
            }),
        );
    });
};
