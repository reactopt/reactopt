import React from 'react';
import { describe, it } from 'jest';
import { shallow } from 'enzyme';
 
import App from './../App';
it('renders without crashing', () => {
    const wrapper = shallow(<App/>);
    console.log(wrapper);
})

// // let uri = process.argv[2]; // gets url from CLI "npm start [url]"
// let uri = './../../css-color-palatte' //test uri for local app folder
// console.log(uri);