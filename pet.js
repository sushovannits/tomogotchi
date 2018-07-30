const EventEmitter = require('events');
class AgeEmitter extends EventEmitter {}
const deathAge = 20;
module.exports = class Pet {
  constructor(name, stateList) {
    this.name = name;
    this.currentHour = 0;
    this.currentAge = 0;
    this.ageEmitter = (new AgeEmitter()).on('dayOver', this.ageHandler.bind(this));
    this.currentState = 'unborn';
    this.stateList = this.expandStateList(stateList);
    this.hunger = 0;
    this.criticalHunger = 20;
    this.happiness = 0;
    this.criticalHappiness = -20;
  }
  update(...message) {
    this.stateManagerCallback.update(...message);
  }
  die() {
    this.stateManagerCallback.update('I am dying');
    if (this.stateManagerCallback) {
      this.currentState = 'dead';
      this.stateManagerCallback.unregister();
    } else {
      throw(new Error('No state manager callback has been registered'));
    }
  }
  ageHandler() {
    // TODO: parameterize this handler
    // TODO: copy paste logic for handling age
    this.currentAge++;
    this.stateManagerCallback.update('I am now age ' + this.currentAge);
    if (this.currentAge === deathAge) {
      this.die();
    }
  }
  registerStateListener(callbackMap) {
    this.stateManagerCallback = callbackMap;
  }
  expandStateList(stateList) {
    const expandedStateList = [];
    stateList.forEach((state) => {
      expandedStateList.push(...Array(state.hoursOfDay).fill(state));
    });
    return expandedStateList;
  }
  updateVitals(vital, value) {
    const halfHappinessCritical = (this.criticalHappiness/2);
    const halfHungerCritical = (this.criticalHunger/2);
    switch(vital) {
      case 'happiness': {
        const newValue = this.happiness - value;
        if (this.happiness >= halfHappinessCritical 
            && newValue < halfHappinessCritical) {
          this.update('I am getting really sad. Please play with me');
        }
        this.happiness = newValue;
        break;
      }
      case 'hunger': {
      const newValue = this.hunger + value;
        if (this.hunger <= halfHungerCritical 
            && newValue > halfHungerCritical) {
          this.update('I am getting really hungry. Feed me');
        }
        this.hunger = newValue;
        break;
      }
      default:
        throw(new Error('Unsupported vital update'));
    }
    return;
  }
  vitalCheckAndUpdate() {
    if (this.happiness < this.criticalHappiness) {
      this.update('I am too sad to stay alive');
      this.die();
      return false;
    }
    if (this.hunger > this.criticalHunger) {
      this.update('I am too hungry to stay alive');
      this.die();
      return false;
    }
    return true;
  }
  handleNextActivity() {
    // Calculate next activity from hour of day
    const allOk = this.vitalCheckAndUpdate();
    if(!allOk) {
      return;
    }
    let nextHour = (this.currentHour + 1)%this.stateList.length;
    // console.debug(`Current hour ${this.currentHour} and next hour is ${nextHour}`);
    const currentState = this.stateList[this.currentHour];
    const nextState = this.stateList[nextHour];
    // this.stateManagerCallback.update('I have completed: ' + this.stateList[this.currentHour]);
    if (currentState !== nextState) {
      currentState.onExitHandler(this);
      if (this.currentState === 'alive') {
        nextState.onEntryHandler(this);
      }
    } else {
      nextState.onEveryHourHandler(this);
    }
    this.currentHour = nextHour;  
  }
}

