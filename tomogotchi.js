const EventEmitter = require('events');
class AgeEmitter extends EventEmitter {}
console.debug = function() {};
class State {
  constructor(name, hoursOfDay) {
    this.name = name;
    this.hoursOfDay = hoursOfDay;
  }
  onEntryHandler(handler) {
    this.onEntryHandler = handler;
  }
  onEntryExitHandler(handler) {
    this.onExitHandler = handler;
  }
  onEveryHourHandler(hanlder) {
    this.onEveryHourHandler = handler;
  }
}

const idleState = new State('idle', 5);
idleState.onEntryHandler = (pet) => {
  console.log('I WILL BE sitting idle now');
};
idleState.onEveryHourHandler = (pet) => {
  console.log('Sitting Idle');
}
idleState.onExitHandler = (pet) => {
  console.log('I am DONE sitting idle now');
};

const poopState = new State('poop', 1);
poopState.onEntryHandler = (pet) => {
  console.log('I WILL BE going to poop now');
};
poopState.onEveryHourHandler = (pet) => {
  console.error('This should not have been called');
}
poopState.onExitHandler = (pet) => {
  console.log('I am DONE pooping now');
};

const sleepState = new State('sleep', 4);
sleepState.onEntryHandler = (pet) => {
  console.log('I WILL BE sleeping now');
};
sleepState.onEveryHourHandler = (pet) => {
  console.log('Still sleeping');
}
sleepState.onExitHandler = (pet) => {
  console.log('I am DONE sleeping now');
  console.log('Another day is over');
  pet.ageEmitter.emit('dayOver');
};


const stateList = [
  idleState, poopState, sleepState
];

class Pet {
  constructor(name) {
    this.name = name;
    this.currentHour = 0;
    this.currentAge = 0;
    this.ageEmitter = (new AgeEmitter()).on('dayOver', this.ageHandler.bind(this));
    this.currentState = 'unborn';
  }
  ageHandler() {
    // TODO: parameterize this handler
    // TODO: copy paste logic for handling age
    this.currentAge++;
    console.log('I am now age ' + this.currentAge);
    if (this.currentAge === 2) {
      console.log('I am dying');
      this.stateManager.end();
    }
  }
  stateManager(sm) {
    console.log(`Setting StateManager ${sm.name} for pet ${pet}`);
    this.stateManager = sm;
  }
  handleNextActivity() {
    // Calculate next activity from hour of day
    let nextHour = (this.currentHour + 1)%this.stateManager.stateList.length;
    console.debug(`Current hour ${this.currentHour} and next hour is ${nextHour}`);
    const currentState = this.stateManager.stateList[this.currentHour];
    const nextState = this.stateManager.stateList[nextHour];
    // console.log('I have completed: ' + this.stateManager.stateList[this.currentHour]);
    if (currentState !== nextState) {
      currentState.onExitHandler(this);
      if (this.currentState === 'alive') {
        nextState.onEntryHandler(this);
      }
    } else {
      nextState.onEveryHourHandler(this);
    }
    // console.log('I am now GOING to: ' + this.stateManager.stateList[nextHour]);
    // if (this.currentHour === 2 && nextHour === 0) {
    //   console.log('Another day is over');
    //   this.ageEmitter.emit('dayOver');
    // }
    this.currentHour = nextHour;  
  }
}

class StateManager {
  constructor(name, pet, stateList) {
    this.name = name;
    this.pet = pet;
    this.stateList = this.expandStateList(stateList);
    // this.rl = initCli();
  }
  expandStateList(stateList) {
    const expandedStateList = [];
    stateList.forEach((state) => {
      expandedStateList.push(...Array(state.hoursOfDay).fill(state));
    });
    return expandedStateList;
  }
  start() {
    this.pet.currentState = 'alive';
    this.dayLoop = setInterval(() => {
        this.pet.handleNextActivity(); // TODO: Make async
    }, 500)
  }
  end() {
    // clearImmediate(this.dayLoop);
    this.pet.currentState = 'dead';
    clearInterval(this.dayLoop);
    // this.rl.close();
  }
}

const pet = new Pet('Mary');
const sm = new StateManager('MyStateManager', pet, stateList);
pet.stateManager = sm;
sm.start();
// setTimeout(() => {
//   sm.end();
// }, 4000); 
// let console.log;
function initCli() {
  const vorpal = require('vorpal')();
  global.console.log = vorpal.log;
  vorpal
    .command('foo', 'Outputs "bar".')
    .action(function(args, callback) {
      this.log('bar');
      callback();
    });
  
  vorpal
    .delimiter('myapp$')
    .show();
  return vorpal;
}
