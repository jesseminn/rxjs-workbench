import { defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

export const finalizeWithValue = <T>(callback: (value: T) => void): MonoTypeOperatorFunction<T> => {
    return (source$: Observable<T>) =>
        defer(() => {
            let lastValue: T;
            return source$.pipe(
                tap(value => (lastValue = value)),
                finalize(() => callback(lastValue)),
            );
        });
};
