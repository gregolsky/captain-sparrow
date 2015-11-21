require('babel/register');
require('../lib/captain-sparrow');

var chai = require('chai');
var should = chai.should();

global.expect = chai.expect;
global.should = should;
