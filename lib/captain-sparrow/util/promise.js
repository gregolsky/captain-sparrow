'use strict';

export default function enhancePromisesWithQMethods () {
    Promise.when = when;
};

function when (o) {
    return o.then ? o : Promise.resolve(o);
}
