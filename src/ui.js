const Vorpal = require('vorpal');
const fsAutocomplete = require('vorpal-autocomplete-fs');
const emoji = require('node-emoji');
const chalk = require('chalk');
const ora = require('ora');
const StateManager = require('./state-manager');
const Pet = require('./pet');
const stateList = require('./state-list');
const actionList = require('./action-list');
const consts = require('./consts');

const vorpal = new Vorpal()
                .delimiter('tomogotchi$')
                .show();
let stateManager;

// TODO: Consider moving the validations into a separate validation function/file
function warningEmojify(message) {
  return emoji.emojify(':x: ' + message);
}

function tickEmojify(message) {
  return emoji.emojify(':white_check_mark: ' + message);
}
/**
 * Game commands
 */
vorpal
  .command('start', 'Starts the game')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(stateManager && stateManager.state === consts.ongoing) {
      return warningEmojify('Game has already started! Create a pet with the "pet <name> command or "play" with your pet');
    }
    if(stateManager && stateManager.state === consts.paused) {
      return warningEmojify('Game has already started but is paused! Resume it with "resume"');
    }
    return true;
  })
  .action(function(args, callback) {
    stateManager = new StateManager('TestStateManager');
    stateManager.registerUI((...message)=> { //TODO: This now behaves just as a console.log. But we can implement a formatter
      vorpal.log(emoji.emojify(...message));
    });
    stateManager.start();
    this.log(tickEmojify('The game has started. Now create a pet with "pet <name>". You can pause/resume game'));
    callback();
  });
vorpal
  .command('pause', 'Pauses the game. All the created pets remain intact.')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.paused) {
      return warningEmojify('Game is already paused. You can resume with "resume"');
    }
    return true;
  })
  .action(function(args, callback) {
    stateManager.pause();
    this.log(tickEmojify('The game is paused'));
    callback();
  })
vorpal
  .command('resume', 'Resumes the game.')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.ongoing) {
      return warningEmojify('Game is already going on. You can pause with "pause"');
    }
    return true;
  })
  .action(function(args, callback) {
    stateManager.start();
    this.log(tickEmojify('The game has resumed'));
    callback();
  })
vorpal
  .command('stop', 'Ends the game. Start again with "start"')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    return true;
  })
  .action(function(args, callback) {
    stateManager.pause();
    stateManager = undefined;
    this.log(tickEmojify('The game is stopped'));
    callback();
  })

/**
 * Pet commands
 */
vorpal
  .command('pet <name>', 'Creates a pet')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.paused) {
      return warningEmojify('Game is paused now. Resume with "resume"');
    }
    return true;
  })
  .action(function(args, callback) {
    try {
      const pet = new Pet(args.name, stateList, actionList);
      stateManager.registerPet(pet);
    } catch(err) {
      this.log(warningEmojify(err));
    }
    
    callback();
  })
vorpal
  .command('play', 'Play with your pet')
  .autocomplete(fsAutocomplete())
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.paused) {
      return warningEmojify('Game is paused. You can resume with "resume"');
    }
    return true;
  })
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
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.paused) {
      return warningEmojify('Game is paused. You can resume with "resume"');
    }
    return true;
  })
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
  .validate((args) => {
    if(!stateManager) {
      return warningEmojify('Please start the game first with the "start" command');
    }
    if(stateManager.state === consts.paused) {
      return warningEmojify('Game is paused. You can resume with "resume"');
    }
    return true;
  })
  .action(async function(args, callback) {
    try {
      const pet = await stateManager.getPet();
      this.log(pet.getVitals());
    } catch (err) {
      this.log('Oh!! that failed because of: ' + err.toString());
    }
  })

  // vorpal
  //   .exec('start')
  //   .then(function(data) {
  //     vorpal.log('Data is ' + data);
  //   })
  //   .catch(function (err) {
  //     vorpal.log('Err is ' + err);
  //   })
  module.exports = { vorpal, stateManager };

  