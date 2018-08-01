const EventEmitter = require('events');
const chalk = require('chalk');
const config = require('./config');
const consts = require('./consts');
class AgeEmitter extends EventEmitter {}
const deathAge = 20;
const opMap = {
  'incr' : (a, b) => a + b,
  'decr' : (a, b) => a - b,
}
module.exports = class Pet {
  constructor(name, stateList, actionList) {
    this.stateListCheck(stateList);
    this.name = name;
    this.currentHour = undefined;
    this.currentAge = 0;
    this.ageEmitter = (new AgeEmitter()).on('dayOver', this.ageHandler.bind(this));
    this.currentState = consts.unborn;
    this.stateList = this.expandStateList(stateList);
    this.registerAction(actionList);
    this.hunger = 0;
    this.criticalHunger = config.criticalHunger; // TODO: Move to config
    this.happiness = 0;
    this.criticalHappiness = config.criticalHappiness; // TODO: Move to config
    this.deathAge = config.deathAge;
  }
  stateListCheck(stateList) {
    // verify that total hours in all the states do not exceed total hour in a day
    if (!stateList) {
      throw new Error('StateList invalid');
    }
    const totalHoursInStateList = stateList.reduce((totalHours, state) => {
      return totalHours + state.hoursOfDay;
    }, 0);
    if (totalHoursInStateList !== config.totalHours) {
      throw new Error('StateList total aggregate time of all states is invalid');
    }
  }
  registerAction(actionList) {
    this.actionMap = {};
    actionList.forEach((action) => {
      action.onRegister(this);
    });
  }
  action(action) {
    if (this.actionMap[action] === undefined){
      this.update(`That is an invalid action: ${action}`);
      return;
    }
    return this.actionMap[action].onInvokeHandler(this);
  }
  update(...message) {
    this.stateManagerCallback.update(...message);
  }
  getVitals() {
    return `Happiness: ${this.happiness} and Hunger: ${this.hunger}`;
  }
  born() {
    this.stateManagerCallback.update('Hurray I am born :birthday: and my name is ' + this.name);
  }
  die() {
    this.stateManagerCallback.update('I am dying......:disappointed:');
    if (this.stateManagerCallback) {
      this.currentState = 'dead';
      this.stateManagerCallback.unregister();
    } else {
      throw(new Error('No state manager callback has been registered'));
    }
  }
  resolveSpanOfLife(prevAge) {
    if (prevAge < config.teenAge && this.currentAge === config.teenAge) {
      return 'and I am now a teen.........:birthday:';
    } else if (prevAge < config.adultAge && this.currentAge === config.adultAge) {
      return 'and I am now an adult..............:beers:';
    } else if (prevAge < config.oldAge && this.currentAge === config.oldAge) {
      return 'and I am now old..............:champagne:';
    } 
  }
  ageHandler() {
    // TODO: parameterize this handler
    // TODO: copy paste logic for handling age
    const prevAge = this.currentAge;
    this.currentAge++;
    const spanOfLife = this.resolveSpanOfLife(prevAge);
    this.stateManagerCallback.update('I am now age ' 
                                      + this.currentAge 
                                      + (spanOfLife ? spanOfLife : ''));
    if (this.currentAge === this.deathAge) {
      this.die();
    }
  }
  registerStateListener(callbackMap) {
    this.stateManagerCallback = callbackMap;
    this.born();
  }
  expandStateList(stateList) {
    const expandedStateList = [];
    stateList.forEach((state) => {
      expandedStateList.push(...Array(state.hoursOfDay).fill(state));
    });
    return expandedStateList;
  }
  updateVitals(vital, op, value) {
    const halfHappinessCritical = (this.criticalHappiness/2);
    const halfHungerCritical = (this.criticalHunger/2);
    switch(vital) {
      case consts.happiness: {
        const newValue = opMap[op](this.happiness, value);
        if (this.happiness >= halfHappinessCritical 
            && newValue < halfHappinessCritical) {
          this.update(chalk.black.bgRed('I am getting really sad. Please play with me'));
        }
        this.happiness = newValue;
        break;
      }
      case consts.hunger: {
      const newValue = opMap[op](this.hunger, value);
        if (this.hunger <= halfHungerCritical 
            && newValue > halfHungerCritical) {
          this.update(chalk.black.bgRed('I am getting really hungry. Feed me'));
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
      this.update(chalk.black.bgRed('I am too sad to stay alive'));
      this.die();
      return false;
    }
    if (this.hunger > this.criticalHunger) {
      this.update(chalk.black.bgRed('I am too hungry to stay alive'));
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
    if (this.currentHour === undefined) {
      this.currentHour = 0;
      const currentState = this.stateList[this.currentHour];
      currentState.onEntryHandler(this);
      return;
    }
    let nextHour = (this.currentHour + 1)%this.stateList.length;
    // console.debug(`Current hour ${this.currentHour} and next hour is ${nextHour}`);
    const currentState = this.stateList[this.currentHour];
    const nextState = this.stateList[nextHour];
    // this.stateManagerCallback.update('I have completed: ' + this.stateList[this.currentHour]);
    if (currentState !== nextState) {
      currentState.onExitHandler(this);
      if (this.currentState === consts.alive) {
        nextState.onEntryHandler(this);
      }
    } else {
      nextState.onEveryHourHandler(this);
    }
    this.currentHour = nextHour;  
  }
}

