const consts = require('./consts');
const config = require('./config');
module.exports =  class StateManager {
  constructor(name, uiHandler) {
    this.name = name;
    this.petMap = {};
    // this.rl = initCli();
  }
  registerPet(pet) {
    // TODO: check if duplicate name
    pet.currentState = consts.alive; // TODO: Move to consts
    pet.registerStateListener({
      unregister: () => {
        delete this.petMap[pet.name];
      },
      update: (...message) => {
        this.uiCallback(...message);
      },
    });
    pet.born();
    this.petMap[pet.name] = pet;
  }
  registerUI(callback) {
    this.uiCallback = callback;
  }
  start() {
    this.dayLoop = setInterval(() => {
      Object.values(this.petMap).forEach((pet) => {
        pet.handleNextActivity(); // TODO: Make async
      });
    }, config.timeIntervalEveryHour);
  }
  async getPet(name) {
    if (Object.keys(this.petMap).length === 0) {
      throw new Error('No pets registered');
    }
    if (name === undefined) {
      if (Object.keys(this.petMap).length > 1) {
        throw new Error('Multiple pets registered. Please provide a name');
      }
      return Object.values(this.petMap)[0];
    }
    if (!this.petMap[name]) {
      this.uiCallback('Error here');
      throw new Error('Pet name not found');
    }
    return this.petMap[name];
  }
  // TODO: Pause functionality
  end() {
    // clearImmediate(this.dayLoop);
    clearInterval(this.dayLoop);
    // this.rl.close();
  }
}
