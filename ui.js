const Vorpal = require('vorpal');
const StateManager = require('./state-manager');
const Pet = require('./pet');
const stateList = require('./state-list');

const vorpal = new Vorpal()
                .delimiter('myapp$')
                .show();
const stateManager = new StateManager('TestStateManager');

stateManager.registerUI((...message)=> {
  // console.log(message);
  vorpal.log(...message);
})

vorpal
  .command('start', 'Starts the game')
  .action(function(args, callback) {
    stateManager.start();
    callback();
  });
vorpal
  .command('pet', 'Creates a pet')
  .action(function(args, callback) {
    const pet = new Pet('Mary', stateList);
    stateManager.registerPet(pet);
    callback();
  })
vorpal
  .command('stop', 'Stops')
  .action(function(args, callback) {
    stateManager.end();
    callback();
  })
  