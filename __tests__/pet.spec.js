const expect = require('expect');
const Pet = require('../pet');
const stateList = require('../state-list');
const actionList = require('../action-list');

describe('test pet class', async () => {
  it('should create a pet', async () => {
    let pet;
    expect(() => {
      pet = new Pet('TestJimmy', stateList, actionList);
    }).not.toThrow();
    expect(pet).toBeDefined();
  })
})