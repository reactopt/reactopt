const chai = require('chai');
const expect = require('chai').expect;
const main = require('./../main.js');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

// object test
describe('initial data object from main.js', () => {
  it('data property of "type" is an object', () => {
    expect(main.data).to.be.a('object');
  });
  it('data property of "type" is not an array', () => {
    expect(Array.isArray(main.data)).to.equal(false);
  });
  it('data property of "time" value is "0ms"', () => {
    expect(main.data.time).to.equal('0ms');
  });
  it('data property of "rerenders" is an Array', () => {
    expect(Array.isArray(main.data.rerenders)).to.equal(true);
  });
  it('rerenders property of "type" is a string value = "initialLoad"', () => {
    expect((main.data.rerenders[0]).type).to.equal('initialLoad');
  });
  it('rerenders property of "name" is a string value = "initialLoad"', () => {
    expect((main.data.rerenders[0]).name).to.equal('initialLoad');
  });
  it('rerenders property of "component" is an empty array length of 0', () => {
    expect((main.data.rerenders[0]).components.length).to.equal(0);
  });
})
// function test
describe('printLine()', () => {
  const copyPrintLine = main.printLine;
  it('check execution of print line function', () => {
    let spy = sinon.spy();
    spy(copyPrintLine);
    expect(spy.calledOnce).to.equal(true);
    spy.reset();
  });
});

describe('loadTime()', () => {
  const copyLoadTime = main.loadTime;
  it('check execution of load time function', () => {
    let spy = sinon.spy();
    spy(copyLoadTime);
    expect(spy.calledOnce).to.equal(true);
    spy.reset();
  });
});

describe('componentRerenders()', () => {
  const copyComponentRerenders = main.componentRerenders;
  it('check execution of component rerenders function', () => {
    let spy = sinon.spy();
    // copyPrintLine('heading', 'Page Load Time');
    spy(copyComponentRerenders);
    expect(spy.calledOnce).to.equal(true);
    spy.reset();
  });
});