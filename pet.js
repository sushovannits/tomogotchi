const EventEmitter = require('events');
class AgeEmitter extends EventEmitter {}
module.exports = class Pet {
  constructor(name, stateList) {
    this.name = name;
    this.currentHour = 0;
    this.currentAge = 0;
    this.ageEmitter = (new AgeEmitter()).on('dayOver', this.ageHandler.bind(this));
    this.currentState = 'unborn';
    this.stateList = this.expandStateList(stateList);
  }
  update(message) {
    this.stateManagerCallback.update(message);
  }
  ageHandler() {
    // TODO: parameterize this handler
    // TODO: copy paste logic for handling age
    this.currentAge++;
    this.stateManagerCallback.update('I am now age ' + this.currentAge);
    if (this.currentAge === 2) {
      this.stateManagerCallback.update('I am dying');
      if (this.stateManagerCallback) {
        this.stateManagerCallback.update('End is getting called');
        this.currentState = 'dead';
        this.stateManagerCallback.unregister();
      } else {

      }
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
  handleNextActivity() {
    // Calculate next activity from hour of day
    let nextHour = (this.currentHour + 1)%this.stateList.length;
    console.debug(`Current hour ${this.currentHour} and next hour is ${nextHour}`);
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

