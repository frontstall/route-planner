import React from 'react';
import renderer from 'react-test-renderer';

import Button from '../../src/components/Button';

it('renders button', () => {
  const component = renderer.create(<Button text="button" />).toJSON();
  expect(component).toMatchSnapshot();
});
