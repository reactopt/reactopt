'use strict';

// declare exports
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _deepDiff = require('./deepDiff');
var _getDisplayName = require('./getDisplayName');
var _normalizeOptions = require('./normalizeOptions');
var _shouldInclude = require('./shouldInclude');


var currentEventName = "initialLoad";
var currentEventType = "initialLoad";

var keyboardEvents = ['keypress', 'keydown', 'input'];
var mouseEvents = ['click', 'dbclick', 'drag'];

// monkeypatch
// ****** called on render -> look down to opts.notifier
function createComponentDidUpdate(opts) {
  return function componentDidUpdate(prevProps, prevState) {
    //displayname is component name
    var displayName = (0, _getDisplayName.getDisplayName)(this);

    //should include returns display/comp name, if return value doesn't exist exit compDidUpdate w/o doing anything
    if (!(0, _shouldInclude.shouldInclude)(displayName, opts)) {
      return;
    }

    var propsDiff = (0, _deepDiff.classifyDiff)(prevProps, this.props, displayName + '.props');
    if (propsDiff.type === _deepDiff.DIFF_TYPES.UNAVOIDABLE) {
      return;
    }

    var stateDiff = (0, _deepDiff.classifyDiff)(prevState, this.state, displayName + '.state');
    if (stateDiff.type === _deepDiff.DIFF_TYPES.UNAVOIDABLE) {
      return;
    }
    //if makes it past above non-conflicts (meaning there are components re-rendering unnecessarily)
    // temp timeout because event listener sets global event names after components re-render
    setTimeout(timeTest,100);
    function timeTest() {
      if (!window.data) {
        window.data = {
          rerenders : [{
            type: type,
            name: name,
            components: []
          }]
        };
      }
      
      // if (!window.data.rerenders[currentEventType]) {
      //       window.data.rerenders[currentEventType] = {};
      // }

      // if (!window.data.rerenders[currentEventType][currentEventName]) {
      //   window.data.rerenders[currentEventType][currentEventName] = {};
      // }

      // storing event data in window's 'data' object
      window.data.rerenders.push(tempObj);
    }

    // ****** call to opts.notifier -> look normalizeOptions bottom
    // ^^^^^^ opts.notifier(opts.groupByComponent, opts.collapseComponentGroups, displayName, [propsDiff, stateDiff]);
  };
}

// takes in react component, triggers all other logic, is exported out
var whyDidYouUpdate = function whyDidYouUpdate(React) {

  // event listener for load page
  window.addEventListener('load', () => {
    // calculation for total time taken to render the webpage
    const startLoadTime = window.performance.timing.loadEventStart
    const endLoadTime = window.performance.timing.domLoading
    const deltaTime = startLoadTime - endLoadTime;
    window.data = {};
    window.data.time = deltaTime + 'ms';
  });

  /**
   * function handler for click, dbclick, and drag
   */
  function handleMouseEvents(e) {
    console.log(e.type);
    currentEventType = e.type;
    let localName = e.target.localName;
    let innerText = '';

    // description string for click elements
    function setInnerText(type, targetInfo) {
      innerText = type +': ' + targetInfo;
    }
    // if clicked element is '<button>', check innerText, then id, then className for descriptor
    if (localName === 'button') {
      if (e.target.innerText) {
        setInnerText('text', e.target.innerText);
      } else if (e.target.id) {
        setInnerText('id', e.target.target.id);
      } else if (e.target.className){
        setInnerText('className', e.target.className);
      } 
    } 
    // if clicked element is '<img>', check alt text, then className for descriptor
    else if (localName === 'img') {
      if (e.target.alt) {
        setInnerText('alt', e.target.alt);
      } else if (e.target.className) {
        setInnerText('className', e.target.className);
      }
    }
    // if clicked element is '<div>', check id, then className for descriptor
    else if (localName === 'div') {
      if (e.target.id) {
        setInnerText('id', e.target.id);
      } else if (e.target.className){
        setInnerText('className', e.target.className);
      } 
    } 
    else {
      innerText = 'unknown';
    }
    currentEventName = localName +' ('+innerText+')';
    // debugging console.log
    // console.log('currentEventName',currentEventName);
  }
  
  /**
   * function handler for key pressed, key down, and input
   */
  function handleKeys(e) {
    currentEventType = e.type;
    currentEventName = e.code;
  }

  // window object listen to different keyboardEvents based on the initial keyboardEvents array
  keyboardEvents.map(eventName => window.addEventListener(eventName, handleKeys));

  mouseEvents.map(eventName => window.addEventListener(eventName, handleMouseEvents));
  
  //FORMATTING options - 1) include or exclude by displayname/component OR 2)by default can group by component
  //if < 1 return true, return empty obj, return arguments[1]
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  //putting original/user's componentDidUpdate and assign it to _componentdidUpdate
  // (saving this as a reference for later when rewriting componentDidUpdate back to original user's definition
  var _componentDidUpdate = React.Component.prototype.componentDidUpdate;

  //opts deals with formatting of console logs
  // ******opts = call to normalizeOptions -> look at componentDidUpdate top
  opts = (0, _normalizeOptions.normalizeOptions)(opts);

  //rewriting original component did update, making it equal execution of createComponentDidUpdate(opts)
  React.Component.prototype.componentDidUpdate = createComponentDidUpdate(opts);

  
  var _createClass = null;
  try {
    //holding orig def of React.createClass in _createClass
    // console logging create class is also undefined
    _createClass = React.createClass;

    if (_createClass) {
      //rewriting orig createclass
      React.createClass = function createClass(obj) {
        // object that has method compDidUpdate that references a call to the new createComponentDidUpdate
        var Mixin = {
          componentDidUpdate: createComponentDidUpdate(opts)
        };

        // adding mixins prop to whatever obj is passed into createClass
        // no console log shows up around here
        if (obj.mixins) {
          obj.mixins = [Mixin].concat(obj.mixins);
        } else {
          obj.mixins = [Mixin];
        }

        //call to original/stored def of createClass
        return _createClass.call(React, obj);
      };
    }
  } catch (e) {}

  // returning lifecylce func defs to original/before WDYU happened
  React.__WHY_DID_YOU_UPDATE_RESTORE_FN__ = function () {
    React.Component.prototype.componentDidUpdate = _componentDidUpdate;
    if (_createClass) {
      React.createClass = _createClass;
    }
    delete React.__WHY_DID_YOU_UPDATE_RESTORE_FN__;
  };
  
  return React;

};

exports.whyDidYouUpdate = whyDidYouUpdate;
exports['default'] = whyDidYouUpdate;