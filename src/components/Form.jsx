import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Input from './Input';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Новая точка',
      isValid: 'true',
    };

    this.inputRef = React.createRef();
    this.formRef = React.createRef();
  }

  componentDidMount() {
    const inputNode = this.inputRef.current;
    inputNode.select();

    document.addEventListener('mousedown', this.onClickOutside);
    document.addEventListener('keydown', this.onEscapePress);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onClickOutside);
    document.removeEventListener('keydown', this.onEscapePress);
  }

  onEscapePress = ({ keyCode }) => {
    if (keyCode === 27) {
      const { onClose } = this.props;

      onClose();
    }
  };

  onClickOutside = ({ target }) => {
    if (!this.formRef.current.contains(target)) {
      const { onClose } = this.props;

      onClose();
    }
  };

  onInputChange = ({ target: { value } }) => {
    this.setState(() => ({ value, isValid: !!value }));
  };

  onSubmit = e => {
    const { onSubmit, onClose } = this.props;
    const { value } = this.state;
    e.preventDefault();
    onSubmit(value);
    onClose();
  };

  render() {
    const { value, isValid } = this.state;

    return (
      <form ref={this.formRef} className="form" onSubmit={this.onSubmit}>
        <div className="form__wrapper">
          <Input
            className="form__input"
            type="text"
            placeholder="Введите название точки"
            value={value}
            onChange={this.onInputChange}
            name="pointName"
            ref={this.inputRef}
            autoComplete="off"
          />
          <div className="form__container">
            <Button
              className="button--iconed-plus"
              type="submit"
              title="Сохранить"
              disabled={!isValid}
            />
          </div>
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Form;
