const expect = require('expect');
const Pet = require('../src/pet');
const stateList = require('../src/state-list');
const actionList = require('../src/action-list');

describe('test pet class', () => {
  it('should create a pet', () => {
    let pet;
    expect(() => {
      pet = new Pet('TestJimmy', stateList, actionList);
    }).not.toThrow();
    expect(pet).toBeDefined();
  })
})