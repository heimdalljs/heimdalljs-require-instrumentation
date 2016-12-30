import { Module } from 'module';
import chai from 'chai';
import Heimdall from 'heimdalljs/heimdall';
import clearRequire from 'clear-require';

import {
  _installLoadWrapper,
  instrument,
  reset
} from '../src';

const { expect } = chai;
const originalLoad = Module._load;

describe('heimdalljs-require-instrumentation', function() {

  beforeEach(function() {
    clearRequire('./fixtures/silly-module');
    clearRequire('./fixtures/slow-module');
  });

  afterEach(function() {
    reset();
    expect(Module._load, 'confirm reset works').to.equal(originalLoad);
  });

  describe('._installLoadWrapper', function() {
    it('callback receives module information', function() {
      let info;
      _installLoadWrapper((_info) => {
        info = _info;
      });

      require('./fixtures/slow-module');

      expect(info.requestedModuleId).to.equal('./fixtures/slow-module');
      expect(info.parentModuleId).to.equal(__filename);
      expect(info.duration).to.be.above(5000000);
    });

    it('does not break `require`ing files', function() {
      let info;
      _installLoadWrapper((_info) => {
        info = _info;
      });

      let ret = require('./fixtures/silly-module');

      expect(ret).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
        derp: ['a', 'b', 'c']
      });
    });
  });
});
