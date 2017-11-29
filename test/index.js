const expect = require('expect');
const main = require('./../main.js');


describe('promise from browser to Node', () => {
  it('data object should have key and value of time', () => {
    expect(main.data.time).toEqual('0ms');
    // expect(gameList[0].winner).toEqual('X');
  });
});