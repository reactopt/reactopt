import React from 'react';
import { describe, it } from 'jest';
import { shallow } from 'enzyme';
 
import App from './../App';
it('renders without crashing', () => {
    const wrapper = shallow(<App/>);
    console.log(wrapper);
})