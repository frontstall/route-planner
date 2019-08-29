import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import App from '../components/App';

const getMapFacadeMocked = () => ({
  clearMap: jest.fn(),
  renderRoute: jest.fn(),
  renderPoints: jest.fn(),
  getCenter: jest.fn(),
  getAddress: jest.fn(),
});

jest.mock('react-beautiful-dnd', () => ({
  Droppable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {},
    ),
  Draggable: ({ children }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: jest.fn(),
      },
      {},
    ),
  DragDropContext: ({ children }) => children,
}));

const points = {
  test1: {
    coordinates: [55.759, 37.64],
    id: 'test1',
    name: 'point one',
  },
  test2: {
    coordinates: [55.7621, 37.6429],
    id: 'test2',
    name: 'point two',
  },
  test3: {
    coordinates: [55.76029, 37.6482],
    id: 'test3',
    name: 'point three',
  },
  test4: {
    coordinates: [55.75556, 37.6488],
    id: 'test4',
    name:
      'point four with really long name you cant believe it can be sooo long',
  },
};

const pointsIds = ['test1', 'test2', 'test3', 'test4'];

describe('renders App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('renders correctly', () => {
    const wrapper = mount(<App points={points} pointsIds={pointsIds} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

describe('adds point', () => {
  const wrapper = mount(<App />);
  wrapper.setState({ mapLoaded: true });
  wrapper.instance().getMapFacade = getMapFacadeMocked;

  it('points list should be empty', () => {
    const pointsList = wrapper.find('.points-list__item');

    expect(pointsList.length).toEqual(0);
  });

  it('should be button for opening form', () => {
    const button = wrapper.find('Button.points__add-point-button');

    expect(button.length).toEqual(1);
  });

  it('button should open form', () => {
    const button = wrapper.find('Button.points__add-point-button');

    button.simulate('click');

    const form = wrapper.find('.form');

    expect(form.length).toEqual(1);
  });

  it('should be button to add point', () => {
    const button = wrapper.find('Button.button--iconed-plus');

    expect(button.length).toEqual(1);
  });

  it('form submitting should add one point', () => {
    const form = wrapper.find('.form');

    form.simulate('submit');

    const pointsList = wrapper.find('li.points-list__item');
    expect(pointsList.length).toEqual(1);
  });
});

describe('remove point', () => {
  const wrapper = mount(<App points={points} pointsIds={pointsIds} />);
  wrapper.instance().getMapFacade = getMapFacadeMocked;

  it('every point item should have button for removing', () => {
    const buttons = wrapper.find('Button.point__remove-button');

    expect(pointsIds.length).toEqual(buttons.length);
  });

  it('click on button should remove one point', () => {
    const pointsCountBeforeDeletion = wrapper.find('li.points-list__item')
      .length;
    const button = wrapper.find('Button.point__remove-button').first();

    button.simulate('click');

    const pointsCountAfterDeletion = wrapper.find('li.points-list__item')
      .length;
    expect(pointsCountBeforeDeletion - pointsCountAfterDeletion).toEqual(1);
  });
});
