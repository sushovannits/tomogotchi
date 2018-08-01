const expect = require('expect');
const { vorpal } = require('../ui');
vorpal.hide();
global.console = {
  log: jest.fn()
}
describe('Tests: start pause resume stop of app. All the success cases', async () => {
  beforeEach(async (done) => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.exec('stop');
    } catch(err) {
      // ignore
    }
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
  it('Test command: start', async (done) => {
    await vorpal.exec('start')
    expect(console.log).toHaveBeenLastCalledWith('✅ The game has started. Now create a pet with \"pet <name>\". You can pause/resume game');
    // expect(stateManager.constructor).toHaveBeenCalled();
    // expect(stateManager.start).toHaveBeenCalled();
    done();
  });
  it('Test command: pause', async (done) => {
    await vorpal.exec('start')
    await vorpal.exec('pause');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game is paused');
    done();
  });
  it('Test command: resume', async (done) => {
    await vorpal.exec('start');
    await vorpal.exec('pause');
    await vorpal.exec('resume');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game has resumed');
    done();
  });
  it('Test command: stop', async (done) => {
    await vorpal.exec('start')
    await vorpal.exec('pause');
    await vorpal.exec('resume');
    await vorpal.exec('stop');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game is stopped');
    done();
  });
});

describe('Tests failure/wrong cases of: start pause resume stop of app.', async () => {
  beforeEach(async (done) => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.exec('stop');
    } catch(err) {
      // ignore
    }
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
  it('Test command: start', async (done) => {
    try {
      await vorpal.exec('start');
      await vorpal.exec('start');    
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Game has already started! Create a pet with the "pet <name> command or "play" with your pet');
      // expect(stateManager.constructor).toHaveBeenCalled();
      // expect(stateManager.start).toHaveBeenCalled();
    }
    done();
  });
  it('Test command: pause', async (done) => {
    try {
      await vorpal.exec('pause');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
    done();
  });
  it('Test command: resume when not started', async (done) => {
    try {
      await vorpal.exec('resume')
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
    try {
      await vorpal.exec('start');
      await vorpal.exec('resume');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Game is already going on. You can pause with "pause"');
    }
    done();
  });
  it('Test command: stop', async (done) => {
    try {
      await vorpal.exec('stop');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
    done();
  });
});