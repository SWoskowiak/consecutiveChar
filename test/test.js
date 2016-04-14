'use strict';

var chai = require('chai'),
  chaiAsPromised = require('chai-as-promised'),
  bddStdin = require('bdd-stdin'),
  expect = chai.expect,
  FindConsecutive = require('../index');

chai.use(chaiAsPromised);

describe('FindConsecutive', () => {
  let FC = new FindConsecutive();

  // Test our prompts
  describe('Prompts work', () => {
    // Mock inputs
    it('runs through prompts', (done) => {
      bddStdin('ghabcdabkbaibabbsabj', '\n', 'ab', '\n');
      expect(FC.ask()).to.eventually.be.an('array').with.length.of(5).notify(done);
    });
  });

  // Run the find method through possible input scenarios
  describe('find()', () => {

    beforeEach(() => {
      FC = new FindConsecutive();
    });

    it('find "ab" four times in "abcdabkbaiba"', () => {
      expect(FC.find('abcdabkbaiba', 'ab')).to.be.an('array').with.length.of(4);
    });

    it('Should find matching elements at the start and end', () => {
      expect(FC.find('ghiiihg', 'hg')).to.be.an('array').with.length.of(2);
    });

    it('Should matching elements inside non matching ends', () => {
      expect(FC.find('lghiiihgl', 'hg')).to.be.an('array').with.length.of(2);
    });

    it('Should match entire string if entire string matches', () => {
      expect(FC.find('hghhhgghghhgggg', 'hg')).to.be.an('array').with.length.of(1);
    });
  });

});
