'use strict';
//load image
require('console-png').attachTo(console);
let image = require('fs').readFileSync(__dirname + '/logo-small.png');

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
let data; 

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
    log(chalk.bgGreen.bold(' Reactopt is running - Interact with your app and then type "done" to perform audit. '));
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

// EVENTUALLY MODULARIZE TESTS
// test functions
function loadTime(data) {
  printLine('heading', 'Page Load Time');
  printLine('pass', 'Your page took ' + data.time + ' to load');
}

function componentRerenders(data) {

  printLine('heading', 'Component Re-rendering');
  log('');

  let eventTypes = Object.keys(data);
  if (eventTypes.length !== 0) {
    let eventNames;
    printLine('fail', 'There are components that unnecessarily re-rendered, and the events that triggered them:');
    log('');
    //print eventTypes, eventNames, and components rerendered for each
    for (let x = 0; x < eventTypes.length; x += 1) {
      if (eventTypes[x] !== 'time') { // filter out non-component data here
        eventNames = Object.keys(data[eventTypes[x]]);
        if (eventNames.length !== 0) {
          // log(eventNames.length);
          for (let y = 0; y < eventNames.length; y += 1) {
            // log('eventNames[y]', eventNames[y]);
            let comps = Object.keys(data[eventTypes[x]][eventNames[y]]);
            
            let eventType = eventTypes[x];
            // log(eventType);
            let eventName = eventNames[y];
            // log(eventName);
            // log('comps', comps);
            log(chalk.underline(eventType) + ': ', chalk.green(eventName), chalk.green(' => ' + comps));
            // log(chalk.underline(data[eventTypes[x]]), chalk.reset.white(' : ' + eventNames[y]), chalk.reset.white( ' ' + comps + ' ')  );
          }
        }
      }
    }
    log('');
  }
  printLine('suggestion', "React components by default re-render on any state change.");  
  printLine('suggestion', "Consider implementing 'shouldComponentUpdate' to prevent re-rendering when \nthe states or props each component utilizes don't change.");

}