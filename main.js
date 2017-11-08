// console.log("made it to reactopt main.js");
'use strict';

var reactopt = require('./src/index.js');
var reactopt = reactopt.whyDidYouUpdate;

// require Puppeteer dependency
const puppeteer = require('puppeteer');

// URL to test
const uri = 'http://localhost:3000/';
// const uri = './../../src/main';
async function runAutomationTest() {
    // launch chrome browser
    const browser = await puppeteer.launch({headless: false});
    // create a new page
    const page = await browser.newPage();
    // tell the browser to navigate to the url
    await page.goto('https://www.google.com');
    const tag = await page.$$('form');
    console.log(tag);
    // close the browser
    // await browser.close();
}
runAutomationTest();

module.export = reactopt;