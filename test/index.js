const main = require('./../main.js');
const expect = require('expect');


describe('promise from browser to Node', () => {
  it('data object should have key and value of time', () => {
    expect(main.data.time).toEqual('0ms');
  });
  it('data object should have rerenders array of length 1', () => {
    expect((main.data.rerenders).length === 1);
  });
  it('data obj rerenders at index 0 should be equal to an empty array', () => {
    expect((main.data.rerenders).length === 1);
  });
});


