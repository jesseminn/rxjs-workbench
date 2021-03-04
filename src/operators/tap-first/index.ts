import { defer, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const tapFirst = <T>(fn: (value: T) => void): MonoTypeOperatorFunction<T> => {
    return (source$: Observable<T>) => {
        return defer(() => {
            let isFirst = true;
            return source$.pipe(
                tap(source => {
                    if (isFirst) {
                        fn(source);
                    }
                    isFirst = false;
                }),
            );
        });
    };
};
