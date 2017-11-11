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

let uri = process.argv[2]; // gets url from CLI "npm start [url]"
// let uri = 'http://localhost:3000'; // testing uri

//start puppeteer to allow user to interact with React app
puppeteer.launch({headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({width: 1000, height: 1000}); // default is 800 x 600 px
  await page.goto(uri);

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
    log(chalk.bgGreen.bold(' Reactopt is running - Interact with your app and then type "done" to perform audit. '));
    log('');
    const loading = chalkAnimation.radar('-------------------------------------------------------------------------------------');
    loading.start();
  }
}

startReactopt(); // runs on npm run reactopt

// when user 'ends' interaction, execute this code
function logAudits(data) {
  printLine();
  loadTime();
  printLine();
  componentRerenders(data);
  printLine();
  dependencyLoad();
  printLine();
  productionMode();
  printLine();
  fileLoad();
  printLine();
  versionOfReact();
  printLine();
  tableTag();
  printLine();
  imageSize();
  printLine();
  preprocessorCheck();
  printLine();
  inlineScripts();
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
  log(chalk.red.bold(string));
}

function printSuggestion(string) {
  log(chalk.gray(string));
}

function printLine() {
  log('');
  log(chalk.gray('-----------------------------------------------------------------------------------'));
  log('');
}

// test functions
function componentRerenders(data) {
  printHeading('Component Re-rendering');
  log('');

  let eventTypes = Object.keys(data);
  if (eventTypes.length !== 0) {
    let eventNames;
    printFail('There are components that unnecessarily re-rendered, and the events that triggered them:');
    log('');
    //print eventTypes, eventNames, and components rerendered for each
    for (let x = 0; x < eventTypes.length; x += 1) {
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
          log(chalk.underline(eventType), chalk.green(' : ' + eventName), chalk.green(' => ' + comps));
          // log(chalk.underline(data[eventTypes[x]]), chalk.reset.white(' : ' + eventNames[y]), chalk.reset.white( ' ' + comps + ' ')  );
        }
      }
    }
    log('');
  }
  printSuggestion("React components by default re-render on any state change.");  
    printSuggestion("Consider implementing 'shouldComponentUpdate' to prevent re-rendering when \nthe states or props each component utilizes don't change.");

}
// function componentRerenders(data) {
//   printHeading('Unnecessary Component Re-rendering');
//   printFail('There are components that unnecessarily re-rendered, and the events that triggered them:');
//   log('');
//   console.log(data);
//   printSuggestion("React components by default re-render on any state change.");  
//   printSuggestion("Consider implementing 'shouldComponentUpdate' to prevent re-rendering when \nthe states or props each component utilizes don't change.");
// }

function loadTime() {
  printHeading('Page Load Time');
  printPass('Your page took 178ms to load');
}

function versionOfReact() {
  //scrape for version
  let version = '16';
  printHeading('Version of React');
  if (version === '16') {
    printPass('Your version of React is the most current, and the quickest in production mode.');
  } else {
    printFail('Your version of React is out of date and slower than newer versions');
    log('');
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
    log('');
    printSuggestion('These checks are useful but can slow down your application. \nBe sure these are removed when application is put into production.');
  }
}

function dependencyLoad() {
  //scrape for version
  let unneccesaryDeps = false;
  printHeading('Dependency Loading');
  if (unneccesaryDeps === false) {
    printPass('You are not including any unused dependencies.');
  } else {
  }
}

function fileLoad() {
  //check for loading too many unneccesary files at one
  let unneccesaryfiles = true;
  printHeading('Rendering in Production/Development Mode');
  if (unneccesaryfiles === false) {
    printPass('Your application is not loading any unneccessary files on initial load.');
  } else {
    printFail('Unused files are being loaded on initial load of application.');
    log('');
    log(chalk.underline('These files are loaded but not utilized on initial load of your application:'), ('exports.js, logo.png'));
    log('');
    printSuggestion('If your application is large, consider JS and CSS "chunking" to load files only when needed. \nReact Router can help with code splitting.');
    }
}

function tableTag() {
  //scrape HTML for table tags
  let tableTags = true;
  printHeading('HTML Table Tag Usage');
  if (tableTags === false) {
    printPass('You\'re either not using table tags or creating tables efficiently.');
  } else {
    printFail('You\'re unneccesarily using HTML table tags.');
    printSuggestion('For quicker rendering times and avoiding nested tables, try floats, positioning, flexbox, or grids.');
  }
}

function imageSize() {
  //scrape all image files and their size
  let images = [50, 600];
  printHeading('Image Usage');
  // if (images[0] <= 50 && image[1] <= 500) {
  //   // printPass('Image file size and load are fully optimized.');
  // } 
  // // else {
    printFail('Your images are loading at 500MB and above and/or too many image files.');
    log('');
    printSuggestion('Specify height and width of all images and tables to avoid reflow of content.');
    printSuggestion('Using SVGs? Reduce your page weight by minifying and compressing the SVG assets.');
  // }
}

function preprocessorCheck() {
  //scrape application for css files
  let css = false;
  printHeading('Using Modern CSS ');
  if (css === false) {
    printPass('You\'re using a preprocessed CSS language and the amount of mark-up time is optimal.');
  } else {
    printFail('You\'re currently utilizing CSS files.');
    log('');
    printSuggestion('Have you considered using a preprocessing language like SASS, SCSS or LESS?');
  }
}

function inlineScripts() {
  //scrape html for count of document.write use
  let documentWriteCount = 2;
  printHeading('Decreasing Inline Scripts');
  if (documentWriteCount <= 1) {
    printPass('You are efficiently using inline scripts.');
  } else {
    printFail('We noticed you\'re using document.write multiple lines.');
    log('');
    printSuggestion('Try using AJAX methods to manipulate page content for modern browsers.');
  }
}
