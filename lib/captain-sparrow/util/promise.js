'use strict';

export default function enhancePromisesWithQMethods () {
    Promise.when = when;
    Promise.allSettled = allSettled;
};

function when (o) {
    return o.then ? o : Promise.resolve(o);
}

function allSettled (promises) {
    let wrappedPromises = promises.map(p => Promise.resolve(p)
        .then(
            val => ({ state: 'fulfilled', value: val }),
            err => ({ state: 'rejected', reason: err })));
    return Promise.all(wrappedPromises);
}
