var assert = require('assert');
const cookies = require('../cookies.js');
const fixtures = require('./fixtures.js');

// unit tests
describe('#haveDietMatch', function() {
  describe('both eater+ and baker+', function() {
    it('should return true', function() {
      assert(cookies.haveDietMatch(
        { "eater+": true, "baker+": true },
        { "eater+": true, "baker+": true }
      ))
    });
  });
  describe('neither eater+ nor baker+', function() {
    it('should return true', function() {
      assert(cookies.haveDietMatch(
        { "eater+": false, "baker+": false },
        { "eater+": false, "baker+": false }
      ))
    });
  });
  describe('one person eater+, other baker+', function() {
    it('should return true', function() {
      assert(cookies.haveDietMatch(
        { "eater+": true, "baker+": false },
        { "eater+": false, "baker+": true }
      ))
    });
  });
  describe('one person eater+, other is not baker+', function() {
    it('should return true', function() {
      assert.equal(cookies.haveDietMatch(
        { "eater+": true, "baker+": false },
        { "eater+": false, "baker+": false }
      ), false)
    });
  });
});

describe('#createBatches', function() {
  describe('normal scenario', function() {
    it('should return something', function() {
      var batches = cookies.createBatches(fixtures.normalScenario);
      assert.equal(batches.length, 5)
    });
  });
});

describe('#main', function() {
  it('testing', function() {
    cookies.main(fixtures.normalScenario);
  })
})

// future home of integration tests
describe('Even numbered participants', function() {
  describe('No people with dietary requirements', function() {
    it.skip('Has no duplicate pairs', function() {
      assert(pairs.uniq);
    });

    it.skip('Length is half the total amount of cookie batches', function() {
      assert.equal(pairs.length, batches.length/2);
    })
  });
});
