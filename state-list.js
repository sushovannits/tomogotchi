const StateManager = require('./state-manager');
const State = require('./state');
const Pet = require('./pet');

const idleState = new State('idle', 10);
idleState.onEntryHandler = (pet) => {
  pet.update('I WILL BE sitting idle now');
};
idleState.onEveryHourHandler = (pet) => {
  pet.update('Sitting Idle');
  pet.updateVitals('happiness', 1)
  pet.updateVitals('hunger', 1)
}
idleState.onExitHandler = (pet) => {
  pet.update('I am DONE sitting idle now');
};

const poopState = new State('poop', 1);
poopState.onEntryHandler = (pet) => {
  pet.update('I WILL BE going to poop now');
  pet.updateVitals('hunger', 4)
};
poopState.onEveryHourHandler = (pet) => {
  throw(new Error('This should not have been called'));
}
poopState.onExitHandler = (pet) => {
  pet.update('I am DONE pooping now');
};

const sleepState = new State('sleep', 10);
sleepState.onEntryHandler = (pet) => {
  pet.update('I WILL BE sleeping now');
};
sleepState.onEveryHourHandler = (pet) => {
  pet.update('Still sleeping');
}
sleepState.onExitHandler = (pet) => {
  pet.update('I am DONE sleeping now');
  pet.update('Another day is over');
  pet.ageEmitter.emit('dayOver');
};


module.exports = [
  idleState, poopState, sleepState
];



// const pet = new Pet('Mary', stateList);
// const sm = new StateManager('MyStateManager');
// sm.registerPet(pet);
// sm.start();
