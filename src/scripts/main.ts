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

function renderWeightSlider(weight: number) {
    return div([
        input('.weight-slider', {
            'attrs': {
                max: '100',
                min: '30',
                type: 'range',
                value: weight
            }
        }),
        span([`Weight: ${weight}kg`]),
        br()
    ]);
}

function renderHeightSlider(height: number) {
    return div([
        input('.height-slider', {
            'attrs': {
                max: '220',
                min: '130',
                type: 'range',
                value: height
            }
        }),
        span([`Height: ${height}cm`]),
        br()
    ]);
}

function calcBmi(weight: number, height: number) {
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);
    return Math.round(bmi * 100) / 100;
}

function main({DOM}: So): Si {
    const changeWeight$ = DOM.select('.weight-slider').events('input').map(ev => Number((ev.target as HTMLInputElement).value));
    const changeHeight$ = DOM.select('.height-slider').events('input').map(ev => Number((ev.target as HTMLInputElement).value));

    const weight$ = changeHeight$.startWith(65);
    const height$ = changeHeight$.startWith(160);

    const state$ = Observable.combineLatest(weight$, height$, (weight, height) => {
        return { weight, height, bmi: calcBmi(weight, height) }
    })

    const dom$ = state$.map(
        ({weight, height, bmi}) =>
            div(
                [
                    renderHeightSlider(height),
                    renderWeightSlider(weight),
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
