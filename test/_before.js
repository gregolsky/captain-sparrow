'use strict';

const sinon = require('sinon');
const mockery = require('mockery');

var chai = require('chai');
chai.use(require('dirty-chai'));
chai.config.includeStack = true;

global.expect = chai.expect;
global.should = chai.should();

global.getLoggerMock = function() {
    return {
        error: sinon.spy(),
        info: sinon.spy()
    };
};

global.useMockery = function(beforeEach, afterEach, createMocks) {
    let mocks;

    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false
        });

        mocks = createMocks();

        Object.keys(mocks).forEach(moduleId => {
            mockery.registerMock(moduleId, mocks[moduleId]);
        });
    });

    afterEach(() => {
        mockery.deregisterAll();
        mockery.disable();
    });
};
