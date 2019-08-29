import React from 'react';
import renderer from 'react-test-renderer';

import Input from '../components/Input';

it('renders input', () => {
  const component = renderer.create(<Input />).toJSON();
  expect(component).toMatchSnapshot();
});
