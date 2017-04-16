import 'core-js/shim';
import {run} from '@cycle/rxjs-run';
import {VNode, h1, makeDOMDriver} from '@cycle/dom';
import {Observable} from 'rxjs';
import {DOMSource} from '@cycle/dom/rxjs-typings';

type So = {
    DOM: DOMSource
};

type Si = {
    DOM: Observable<VNode>
};

function main({DOM}: So): Si {
    const dom$ = Observable.of(h1(['It works!']));

    return {
        DOM: dom$
    };
}

run(main, {
    DOM: makeDOMDriver('#app')
});
