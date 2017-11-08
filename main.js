// console.log("made it to reactopt main.js");
'use strict';

var reactopt = require('./src/index.js');
var reactopt = reactopt.whyDidYouUpdate;

const chromeLauncher = require('chrome-launcher');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//start chrome-launcher to allow user to interact with React app
chromeLauncher.launch({
  startingUrl: 'http://localhost:3000',
}).then((chrome) => {
  rl.on('line', (line) => {
    if (line === 'exit') {
      chrome.kill();
    }
  });
});

module.export = reactopt;
