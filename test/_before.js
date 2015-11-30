'use strict';

require('babel-core/register');

require('../lib/captain-sparrow');

var chai = require('chai');
chai.config.includeStack = true;

global.expect = chai.expect;
global.should = chai.should();
