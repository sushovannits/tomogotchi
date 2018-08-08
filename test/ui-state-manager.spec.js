const expect = require('expect');
const { vorpal } = require('../src/ui');
vorpal.hide();
global.console = {
  log: jest.fn()
}
describe('Tests: start pause resume stop of app. All the success cases', () => {
  beforeEach(async () => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.execSync('stop');
    } catch(err) {
      // ignore
    }
  });
  afterAll(async () => {
    try {
      await vorpal.execSync('stop')
    } catch(err) {
    }
  });
  // Success cases
  it('Test command: start', async () => {
    await vorpal.execSync('start')
    expect(console.log).toHaveBeenLastCalledWith('✅ The game has started. Now create a pet with \"pet <name>\". You can pause/resume game');
    // expect(stateManager.constructor).toHaveBeenCalled();
    // expect(stateManager.start).toHaveBeenCalled();
  });
  it('Test command: pause', async () => {
    await vorpal.execSync('start')
    await vorpal.execSync('pause');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game is paused');
  });
  it('Test command: resume', async () => {
    await vorpal.execSync('start');
    await vorpal.execSync('pause');
    await vorpal.execSync('resume');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game has resumed');
  });
  it('Test command: stop', async () => {
    await vorpal.execSync('start')
    await vorpal.execSync('pause');
    await vorpal.execSync('resume');
    await vorpal.execSync('stop');
    expect(console.log).toHaveBeenLastCalledWith('✅ The game is stopped');
  });
});

describe('Tests failure/wrong cases of: start pause resume stop of app.', () => {
  beforeEach(async () => {
    // stateManager.start = jest.fn();
    try {
      await vorpal.execSync('stop');
    } catch(err) {
      // ignore
    }
  });
   afterAll(async () => {
    try {
      await vorpal.execSync('stop')
    } catch(err) {
    }
  });
  // Success cases
  it('Test command: start', async () => {
    try {
      await vorpal.execSync('start');
      await vorpal.execSync('start');    
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Game has already started! Create a pet with the "pet <name> command or "play" with your pet');
      // expect(stateManager.constructor).toHaveBeenCalled();
      // expect(stateManager.start).toHaveBeenCalled();
    }
  });
  it('Test command: pause', async () => {
    try {
      await vorpal.execSync('pause');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
  });
  it('Test command: resume when not started', async () => {
    try {
      await vorpal.execSync('resume')
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
    try {
      await vorpal.execSync('start');
      await vorpal.execSync('resume');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Game is already going on. You can pause with "pause"');
    }
  });
  it('Test command: stop', async () => {
    try {
      await vorpal.execSync('stop');
    } catch(err) {
      expect(console.log).toHaveBeenLastCalledWith('❌ Please start the game first with the "start" command');
    }
  });
});