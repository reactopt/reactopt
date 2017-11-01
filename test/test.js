const chromeLauncher = require('chrome-launcher');


let uri = process.argv[2];

// let uri = 'https://google.com';
let url; 
chromeLauncher.launch({
  startingUrl: uri
}).then(chrome => {
  url = chrome.port;
  console.log(`Chrome debugging port running on ${chrome.port}`);
});