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

describe('#createMatrixBatches', function() {
  describe('normal scenario', function() {
    it('should return something', function() {
      var batches = cookies.createMatrixBatches(fixtures.normalScenario);
      assert.equal(batches.length, 5)
    });
  });
});

describe('#cookieTime', function() {
  it('should run the script with fake data', function() {
    cookies.cookieTime(fixtures.normalScenario);
  })
})

// future home of integration tests

// test that there aren't duplicate batches
// test that people with two batches are matched twice
// test dietary matchups
