'use strict';

enhancePromisesWithQMethods();

function enhancePromisesWithQMethods() {
    Promise.when = when;
    Promise.allSettled = allSettled;
    Promise.prototype.finally = _finally;
};

function when(o) {
    return o.then ? o : Promise.resolve(o);
}

function allSettled(promises) {
    let wrappedPromises = promises.map(p => Promise.resolve(p)
        .then(
            val => ({ state: 'fulfilled', value: val }),
            err => ({ state: 'rejected', reason: err })));
    return Promise.all(wrappedPromises);
}

function _finally(handler) {
    function wrapHandler() {
        return new Promise((resolve, reject) => {
            try {
                let result = handler();
                if (result.then) {
                    return result.then(() => resolve(), () => resolve());
                }
            } catch (err) {
                resolve();
            }
        })
            .catch(() => {});
    }

    return this.then(result => {
        return wrapHandler()
            .then(() => result);
    }, reason => {
        return wrapHandler()
            .then(() => {
                throw reason;
            });
    });
}
