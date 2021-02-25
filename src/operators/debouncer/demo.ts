import { Subject } from 'rxjs/internal/Subject';
import { scan } from 'rxjs/operators';
import { afterDebouncerTime } from '.';

const click$ = new Subject();

click$
    .pipe(
        scan(acc => acc + 1, 0),
        afterDebouncerTime(1000),
    )
    .subscribe(v => {
        console.log('clicked!', v);
    });

const body = document.querySelector('body');
const button = document.createElement('button');
button.innerText = 'click';
button.addEventListener('click', () => {
    click$.next();
});
body && body.append(button);
