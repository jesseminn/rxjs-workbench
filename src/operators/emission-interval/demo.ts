import { Subject } from 'rxjs';
import { emissionIntervalLog } from '.';

const message$ = new Subject<number>();
message$
    .pipe(
        emissionIntervalLog({
            label: 'message emission',
            formatter: interval => interval.join(),
        }),
    )
    .subscribe(v => {
        console.log('message: ', v);
    });

const messageButton = document.createElement('button');
messageButton.textContent = 'message';
messageButton.addEventListener('click', () => {
    message$.next(Math.random());
});
document.body.appendChild(messageButton);
