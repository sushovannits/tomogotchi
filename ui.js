const Vorpal = require('vorpal');
const fsAutocomplete = require('vorpal-autocomplete-fs');
const emoji = require('node-emoji');
const chalk = require('chalk');
const ora = require('ora');
const StateManager = require('./state-manager');
const Pet = require('./pet');
const stateList = require('./state-list');
const actionList = require('./action-list');

const vorpal = new Vorpal()
                .delimiter('tomogotchi$')
                .show();
const stateManager = new StateManager('TestStateManager');

stateManager.registerUI((...message)=> { //TODO: This now behaves just as a console.log. But we can implement a formatter
  vorpal.log(emoji.emojify(...message));
})

vorpal
  .command('start', 'Starts the game')
  .autocomplete(fsAutocomplete())
  .action(function(args, callback) {
    stateManager.start();
    callback();
  });
vorpal
  .command('pet <name>', 'Creates a pet')
  .autocomplete(fsAutocomplete())
  .action(function(args, callback) {
    const pet = new Pet(args.name, stateList, actionList);
    stateManager.registerPet(pet);
    callback();
  })
vorpal
  .command('stop', 'Stops')
  .autocomplete(fsAutocomplete())
  .action(function(args, callback) {
    stateManager.end();
    callback();
  })
vorpal
  .command('play', 'Play with your pet')
  .autocomplete(fsAutocomplete())
  .action(async function(args, callback) {
    try {
      const pet = await stateManager.getPet(); // TODO: Extend for multiple pet. Pass petname here
      pet.action('play'); // TODO: Move all static strings to consts
    } catch (err) {
      this.log(chalk.black.bgRed('Oh!! that failed because of: ' + err.toString()));
    }
  })
vorpal
  .command('feed', 'Feed the pet')
  .autocomplete(fsAutocomplete())
  .action(async function(args, callback) {
    try {
      const pet = await stateManager.getPet(); // TODO: Extend for multiple pet. Pass petname here
      pet.action('feed'); // TODO: Move all static strings to consts
    } catch (err) {
      this.log('Oh!! that failed because of: ' + err.toString());
    }
  })
vorpal
  .command('get-vitals', 'Get vitals of pet')
  .autocomplete(fsAutocomplete())
  .action(async function(args, callback) {
    try {
      const pet = await stateManager.getPet();
      this.log(pet.getVitals());
    } catch (err) {
      this.log('Oh!! that failed because of: ' + err.toString());
    }
  })
  