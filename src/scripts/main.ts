import 'core-js/shim';
import { run } from '@cycle/rxjs-run';
import { VNode, CycleDOMEvent, div, h1, input, span, br, makeDOMDriver } from '@cycle/dom';
import { Observable } from 'rxjs';
import { DOMSource } from '@cycle/dom/rxjs-typings';

type So = {
    DOM: DOMSource
};

type Si = {
    DOM: Observable<VNode>
};

function main({DOM}: So): Si {
    const inputWeight$ = DOM.select('.weight').events('input');
    const inputHeight$ = DOM.select('.height').events('input');

    const hogeWeight$ = inputWeight$.map(
        (e: CycleDOMEvent) => Number((e.target as HTMLInputElement).value)
    );
    const weight$ = Observable.merge(
        hogeWeight$,
        Observable.of(65)
    );
    const height$ = inputHeight$.map((e: CycleDOMEvent) => Number((e.target as HTMLInputElement).value)).startWith(160);

    const bmi$ = Observable.combineLatest(
        weight$,
        height$,
        (weight, height) => weight / height / height * 10000
    );

    const dom$ = Observable.combineLatest(
        weight$, height$, bmi$,
        (weight, height, bmi) =>
            div(
                [
                    input('.weight', {
                        "attrs": {
                            'max': '100',
                            'min': '30',
                            'type': 'range'
                        }
                    }),
                    span([weight + ' kg']),
                    br(),
                    input('.height', {
                        "attrs": {
                            'max': '220',
                            'min': '100',
                            'type': 'range'
                        }
                    }),
                    span([height + ' cm']),
                    br(),
                    h1('.result', [bmi])
                ]
            )
    );

    return {
        DOM: dom$
    };
}

run(main, {
    DOM: makeDOMDriver('#app')
});
