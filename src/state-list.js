const State = require('./state');
const config = require('./config');
const consts = require('./consts'); 

const idleState = new State(consts.idle, config.idleStateTime);
idleState.onEntryHandler = (pet) => {
  pet.update('I WILL BE sitting idle now.................:seat:');
};
idleState.onEveryHourHandler = (pet) => {
  pet.update(':disappointed_relieved:');
  pet.updateVitals(consts.happiness, consts.decr, config.idleHappinessDecr);
  pet.updateVitals(consts.hunger, consts.incr, config.idleHungerIncr);
}
idleState.onExitHandler = (pet) => {
  pet.update('I am DONE sitting idle now');
};

const poopState = new State(consts.poop, config.poopStateTime);
poopState.onEntryHandler = (pet) => {
  pet.update('I WILL BE going to poop now....................:poop:');
  pet.updateVitals(consts.hunger, consts.incr, config.poopHungerIncr);
};
poopState.onEveryHourHandler = (pet) => {
  throw(new Error('This should not have been called'));
}
poopState.onExitHandler = (pet) => {
  pet.update('I am DONE pooping now');
};

const sleepState = new State(consts.sleep, config.sleepStateTime);
sleepState.onEntryHandler = (pet) => {
  pet.update('I WILL BE sleeping now...................:zzz:');
};
sleepState.onEveryHourHandler = (pet) => {
  pet.update(':zzz:');
}
sleepState.onExitHandler = (pet) => {
  pet.update('I am DONE sleeping now. Good morning...............:city_sunrise:');
  pet.update('Another day is over');
  pet.ageEmitter.emit(consts.dayOver);
};


module.exports = [
  idleState, poopState, sleepState
];

