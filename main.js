'use strict';

//load image
require('console-png').attachTo(console);
let image = require('fs').readFileSync(__dirname + '/media/logo-cli.png');

// chalk requirements
const chalk = require('chalk');
const log = console.log;

const puppeteer = require('puppeteer');
// middleware for reading cli text input
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// placeholder for data object window events
let data; // comment out for testing

// // data for testing suite
// let data = {
//   time: '0ms',
//   rerenders : [{
//     type: 'initialLoad',
//     name: 'initialLoad',
//     components: []
//   }]
// };

let uri = process.argv[2]; // gets url from CLI "npm start [url]"

//start puppeteer to allow user to interact with React app
puppeteer.launch({headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000}); // chromium default is 800 x 600 px
  await page.goto(uri);

  //close browser on 'done' but also grab data before closing browser
  await rl.on('line', (line) => {
    if (line === 'done') {
      page.evaluate(() => {
        return window.data
      }).then((returnedData) => {
        data = returnedData;
        browser.close();
        return data;
      }).then(logAudits)
      .catch((err) => console.log('Error, no data collected. Try interacting more with your page.'));
    }
  });
});

//runs on start of reactopt
(function startReactopt() {
  console.png(image);
  setTimeout(reactoptRun,1000);
  function reactoptRun() {
    log('');
    log('');
    log(chalk.bgGreen.bold(" Reactopt is running - Interact with your app, don't close the browser, then type 'done' to perform audit. "));
    log('');
  }
})(); // iife

// when user ends interaction with 'done', execute these audits
function logAudits() {
  var funcArray = [
    loadTime,
    componentRerenders
  ];

  // run functions in funcArray, with printLine prior to each
  funcArray.forEach((eventsMethod) => {
    printLine();
    eventsMethod(data);
  });
}

// styling for different console logs
function printLine(type, string) {
  switch (type) {
    case 'heading':
      log(chalk.black.bgWhite.dim(string));
      log('');
      break;
    case 'pass':
      log(chalk.green.bold(string));
      break;
    case 'fail':
      log(chalk.red.bold(string));
      break;
    case 'suggestion':
      log(chalk.gray(string));
      break;
    case 'line':
      log('');
      log(chalk.gray('-----------------------------------------------------------------------------------'));
      log('');
      break;
    default: 
      break;
  }
}

let indentD = '    $ ';
let indent = '    ';

// test functions
function loadTime(data) {
  printLine('heading', 'Page Load Time');
  log(indent + 'Your page took ' + data.time + ' to load');
  log('');
}

function componentRerenders(data) {
  printLine('heading', 'Component Re-rendering');

  if (data.rerenders.length > 1) {
    printLine('fail', 'There are components that are potentially re-rendering unnecessarily. Below are identified events that triggered them:');
    log('');
    // print eventTypes, eventNames, and components rerendered for each unnecessary rerendering
    for (let i = 1; i < data.rerenders.length; i += 1) {
      if ((data.rerenders[i].components).length > 0) {
        log(indentD + chalk.underline(data.rerenders[i].type + ' - ' +  data.rerenders[i].name) + ' => ' + data.rerenders[i].components);
      }
    }
    log('');
    // print suggestions for possible improvements
    log(chalk.italic('Possible improvements to re-rendering'));
    log('');
    printLine('suggestion', indent + "* " + "Consider utilizing 'shouldComponentUpdate' for components that shouldn't be constantly re-rendering: https://reactjs.org/docs/react-component.html#shouldcomponentupdate");
    printLine('suggestion', indent + "* " + "Note: this may affect functionality of child components");
    } else {
    printLine('pass', indent + 'Way to go, Idaho! No unnecessary re-rendering of components were detected.');
    log('');
  }
}

Object.defineProperty(exports, '__esModule', {
  value: true
});

// exports.data = data;
module.exports = { data, loadTime, printLine, componentRerenders };
