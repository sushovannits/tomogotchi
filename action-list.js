const Action = require('./action');
const config = require('./config');
const consts = require('./consts');

const playAction = new Action(consts.play);
playAction.onInvokeHandler = (pet) => {
  if (pet.stateList[pet.currentHour].name === consts.sleep) {
    pet.update('Sorry I am sleeping will play later');
    return;
  }
  pet.update('Hurray!! play time');
  pet.updateVitals(consts.happiness, consts.incr, config.playHappinessIncr);
  pet.updateVitals(consts.hunger, consts.incr, config.playHungerIncr);
}

const feedAction = new Action(consts.feed);
feedAction.onInvokeHandler = (pet) => {
  if (pet.stateList[pet.currentHour].name === consts.sleep) {
    pet.update('Sorry I am sleeping will eat later');
    return;
  }
  pet.update('Food!! Food!! Food!!');
  pet.updateVitals(consts.happiness, INCR, config.feedHappinessIncr);
  pet.updateVitals(consts.hunger, DECR, config.feedHungerDecr);
}

module.exports = [
  playAction, feedAction
]