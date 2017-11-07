'use strict';

import moment from 'moment';

export default function timeout (ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() =>
            reject(new Error(`Timeout reached after ${ moment.duration(ms).humanize() }.`)), ms);
    });
}
