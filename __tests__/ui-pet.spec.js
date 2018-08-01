const expect = require('expect');
const { vorpal } = require('../ui');
const config = require('../config');
vorpal.hide();
global.console = {
  log: jest.fn(),
  warn: jest.fn(warn => {
    throw new Error(warn);
  })
}
// jest.useFakeTimers();
describe('Tests: pet <name>, play, feed, get-vitals. All the success cases', async () => {
  beforeEach(async (done) => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.exec('stop');
    } catch(err) {
      // ignore
    }
    await vorpal.exec('start');
    done();
  });
  afterAll(async (done) => {
    try {
      await vorpal.exec('stop')
    } catch(err) {
    }
    done();
  });
  // Success cases
  it('Test command: pet TestJimmy', async (done) => {
    await vorpal.exec('pet TestJimmy');
    expect(console.log).toHaveBeenLastCalledWith('Hurray I am born 🎂 and my name is TestJimmy');
    // expect(stateManager.constructor).toHaveBeenCalled();
    // expect(stateManager.start).toHaveBeenCalled();
    done();
  });
  it('Test command: normal passage of time', async (done) => {
    await vorpal.exec('pet TestJimmy')
    jest.advanceTimersByTime(config.timeIntervalEveryHour);
    expect(console.log).toHaveBeenLastCalledWith('I WILL BE sitting idle now.................💺');
    jest.advanceTimersByTime(config.timeIntervalEveryHour * config.idleStateTime);
    expect(console.log).toHaveBeenLastCalledWith('I WILL BE going to poop now....................💩');
    done();
  });
  it('Test command: play that is increases happiness and hunger', async (done) => {
    await vorpal.exec('pet TestJimmy')
    jest.advanceTimersByTime(config.timeIntervalEveryHour);
    await vorpal.exec('get-vitals');
    expect(console.log).toHaveBeenLastCalledWith('Happiness: 0 and Hunger: 0');
    await vorpal.exec('play');
    await vorpal.exec('get-vitals');
    expect(console.log).toHaveBeenLastCalledWith('Happiness: ' + config.playHappinessIncr + ' and Hunger: ' + config.playHungerIncr);
    done();
  });
});