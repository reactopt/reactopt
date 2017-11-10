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

let data; 

//start puppeteer to allow user to interact with React app
puppeteer.launch({headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');

  //close browser on 'exit' but also grab data before closing browser
  await rl.on('line', (line) => {
    if (line === 'done') {
      page.evaluate(() => {
        return window.data
      }).then((returnedData) => {
        data = returnedData;
        browser.close();
        return data;
      }).then(printToCLI);
    }
  });
});

function printLogo() {
  // console.log("printlogo data", data);
  require('console-png').attachTo(console);
  let image = require('fs').readFileSync(__dirname + '/logo-small.png');
  console.png(image);
}

function printToCLI() {
  // console.log(data);
  logAudits(data);
  //add functionality here to grab data to print to CLI
}

//runs on start of reactopt
function startReactopt() {
  printLogo();
  setTimeout(reactoptRun,1000);
  function reactoptRun() {
    log('');
    log('');
    log(chalk.bgGreen.bold('Reactopt is running - Interact with your app and then type/enter "end"'));
    log('');
    const loading = chalkAnimation.radar('----------------------------------------------------------------------');
    loading.start();
  }
}

startReactopt(); // runs on npm run reactopt

// when user 'ends' interaction, execute this code
function logAudits(data) {
  printLine();
  componentRerenders(data);
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
  log(chalk.green.bold(string));
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
  printHeading('Component Re-rendering');
  log('');
  console.log('hey boy');

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