'use strict';

//chalk requirements
const chalk = require('chalk');
const chalkAnimation = require('chalk-animation');
const log = console.log;

const puppeteer = require('puppeteer');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//start puppeteer to allow user to interact with React app
puppeteer.launch({headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //close browser on 'exit' but also grab data before closing browser
  await rl.on('line', (line) => {
    if (line === 'exit') {
      page.evaluate(() => {
        return window.data
      }).then((returnedData) => {
        data = returnedData;
        browser.close();
        printToCLI();
      });
    }
  });

  function printToCLI() {
    //add functionality here to grab data to print to CLI
    console.log(data);
  }

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
function componentRerenders(data) {
  console.log('hey boy');
  // imports data object from data.js
  // data = require('./src/index.js').data;
  console.log("data yay!", data);
  for (var key in data) {
    log(chalk.white('On ' + key + ' of ' + data[key] + ' rerendered the following components:'));
    if (data[key] !== null && typeof data[key] === "object") {
      // Recurse into children
      componentRerenders(data[key]);
    }
  }
}
// Object.keys(data).forEach((key) => {
// log('On ' data.eventType ' of ' data.eventName ' rerendered the following components:');
// log(data.eventType.eventName);
// )

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


