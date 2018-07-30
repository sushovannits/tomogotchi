module.exports =  class StateManager {
  constructor(name, uiHandler) {
    this.name = name;
    this.petMap = {};
    // this.rl = initCli();
  }
  registerPet(pet) {
    // TODO: check if duplicate name
    this.petMap[pet.name] = pet;
    pet.currentState = 'alive';
    pet.registerStateListener({
      unregister: () => {
        delete this.petMap[pet.name];
      },
      update: (...message) => {
        this.uiCallback(...message);
      },
    });
  }
  registerUI(callback) {
    this.uiCallback = callback;
  }
  start() {
    this.dayLoop = setInterval(() => {
      Object.values(this.petMap).forEach((pet) => {
        pet.handleNextActivity(); // TODO: Make async
      });
    }, 1000)
  }
  end() {
    // clearImmediate(this.dayLoop);
    clearInterval(this.dayLoop);
    // this.rl.close();
  }
}
