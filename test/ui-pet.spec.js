const expect = require('expect');
const { vorpal } = require('../src/ui');
const config = require('../src/config');
global.console = {
  log: jest.fn(),
  warn: jest.fn(warn => {
    throw new Error(warn);
  })
}
// jest.useFakeTimers();
 describe('Tests: pet <name>, play, feed, get-vitals. All the success cases', () => {
  beforeAll(async () => {
    await vorpal.hide();
  })
  beforeEach(async () => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.execSync('stop');
    } catch(err) {
      // ignore
    }
    await vorpal.execSync('start');
  }, 10000);
  afterAll(async () => {
    try {
      await vorpal.execSync('stop');
      // await vorpal.execSync('exit')
    } catch(err) {
    }
  }, 10000);
  // Success cases
  it('Test command: pet TestJimmy', async () => {
    await vorpal.execSync('pet TestJimmy');
    expect(console.log).toHaveBeenLastCalledWith('Hurray I am born 🎂 and my name is TestJimmy');
    // expect(stateManager.constructor).toHaveBeenCalled();
    // expect(stateManager.start).toHaveBeenCalled();
  }, 10000);
  it('Test command: normal passage of time', async () => {
    await vorpal.execSync('pet TestJimmy')
    jest.advanceTimersByTime(config.timeIntervalEveryHour);
    expect(console.log).toHaveBeenLastCalledWith('I WILL BE sitting idle now.................💺');
    jest.advanceTimersByTime(config.timeIntervalEveryHour * config.idleStateTime);
    expect(console.log).toHaveBeenLastCalledWith('I WILL BE going to poop now....................💩');
  }, 10000);
  it('Test command: play that it increases happiness and hunger', async () => {
    await vorpal.execSync('pet TestJimmy')
    jest.advanceTimersByTime(config.timeIntervalEveryHour);
    await vorpal.execSync('get-vitals');
    expect(console.log).toHaveBeenLastCalledWith('Happiness: 0 and Hunger: 0');
    await vorpal.execSync('play');
    await vorpal.execSync('get-vitals');
    expect(console.log).toHaveBeenLastCalledWith('Happiness: ' + config.playHappinessIncr + ' and Hunger: ' + config.playHungerIncr);
  }, 10000);
});