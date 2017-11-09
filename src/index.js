'use strict';
// console.log("made it to why-did-you-update index.js");
//unknown
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _deepDiff = require('./deepDiff');

var _getDisplayName = require('./getDisplayName');

var _normalizeOptions = require('./normalizeOptions');

var _shouldInclude = require('./shouldInclude');

// data is an object
// var data = require('./../data');
let data = {
  initialLoad: {
    initialLoad: {}
  },
};

var currentEventName = "initialLoad";
var currentEventType = "initialLoad";

// function automatedEvent() {
//   //placeholder for every time one of our automated test events happens
//   //call to eventHappens w/ event name/description as string argument
//   eventHappens("testEventName");
// }

//this logic will be placed (not in a function) inside of logic when each auto event occurs
function eventHappens(eventName, eventType) {
  currentEventName = eventName;
  currentEventType = eventType;
  if (!data[eventType][eventName]) {
    data[eventType][eventName] = {};
  }
}

//test invocation
// automatedEvent();

// monkeypatch
// ****** called on render -> look down to opts.notifier
function createComponentDidUpdate(opts) {
  return function componentDidUpdate(prevProps, prevState) {
    //displayname is comp name
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
    //if makes it past above non-conflicts   
    // ****** call to opts.notifier -> look normalizeOptions bottom
    data[currentEventType][currentEventName][displayName] = displayName;
    opts.notifier(opts.groupByComponent, opts.collapseComponentGroups, displayName, [propsDiff, stateDiff]);
  };
}
// takes in react component, triggers all other logic, is exported out
var whyDidYouUpdate = function whyDidYouUpdate(React) {

  // //CANDACE DO THIS: event listener to grab event type & target
  // window.addEventListener('click', (e) => {
  //   currentEventType = e;
  //   currentEventName = e.target.value;
  //   for(let currentEventName in data){
  //     if(!currentEventName){
  //   data[currentEventType] = currentEventName;
  //     }

  // }

  //     })
  
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
        console.log("boo!!");
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
    // test lod of data
    console.log("OUR DATA OBJECT (holding events & their components)", data);
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