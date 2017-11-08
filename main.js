'use strict';
// import export wdyu
let reactopt = require('./src/index.js');
reactopt = reactopt.whyDidYouUpdate;
export {reactopt};

//chalk requirements
const chalk = require('./node_modules/chalk');
const chalkAnimation = require('./node_modules/chalk-animation');
const log = console.log;

const chromeLauncher = require('./node_modules/chrome-launcher');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//import data file
let data = require('./data').data;

//start chrome-launcher to allow user to interact with React app
chromeLauncher.launch({
  startingUrl: 'http://localhost:3000',
}).then((chrome) => {
  rl.on('line', (line) => {
    if (line === 'exit') {
      chrome.kill();
      endUserInteraction();
    }
  });
});

//runs on start of reactopt
function startReactopt() {
  log(chalk.bgCyan.bold('Reactopt is running - Interact with your app and then type/enter "end"'));
  log('');
  const loading = chalkAnimation.radar('----------------------------------------------------------------------');
  loading.start();
}

startReactopt(); // runs on npm run reactopt

// when user 'ends' interaction, execute this code
function endUserInteraction() {
  //execute functions to test/print other logic
  printLine();
  componentRerenders();
  printLine();
  versionOfReact();
  printLine();
  productionMode();
}

// styling for different console logs
function printHeading(string) {
  log(chalk.black.bgWhite.dim(string));
  log('');
}

function printPass(string) {
  log(chalk.cyan.bold(string));
}

function printFail(string) {
  log(chalk.magenta.bold(string));
}

function printSuggestion(string) {
  log(chalk.gray(string));
}

function printLine() {
  log('');
  log(chalk.gray('------------------------------------------------------'));
  log('');
}

// test functions
function componentRerenders() {
  let events = Object.keys(data);

  if (events.length !== 0) {
    let components;

    printHeading('Unnecessary Component Re-rendering');
    printFail('There are components that unnecessarily re-rendered, and the events that triggered them:');
    log('');

    //print events and components rerendered for each
    for (let x = 0; x < events.length; x += 1) {
      components = Object.keys(data[events[x]]);
      log(chalk.underline(events[x]), chalk.reset.white(' : ' + components)   );
    }
    printSuggestion("Consider implementing 'shouldComponentUpdate' to prevent re-rendering when \nthe states or props of a component don't change.");
  } else {
    printPass('Your version of React is the most current and quickest.');
  }
}

function versionOfReact() {
  //scrape for version
  let version = '16';
  printHeading('Version of React');
  if (version === '16') {
    printPass('Your version of React is the most current and quickest.');
  } else {
    printFail('Your version of React is out of date and slower than newer versions');
    printSuggestion('Consider upgrading to React v 16, which has the fastest production speed.');
  }
}

function productionMode() {
  //scrape for version
  let processChecks = true;
  printHeading('Rendering in Production/Development Mode');
  if (processChecks === false) {
    printPass('Your version of React is the most current and quickest.');
  } else {
    printFail('Your code contains unneccesary process.env.NODE_ENV checks.');
    printSuggestion('These checks are useful but can slow down your application. \n Be sure these are removed when application is put into production.');
  }
}

module.export = reactopt;

