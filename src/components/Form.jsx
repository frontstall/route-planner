import React from 'react';
import Button from './Button';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Новая точка',
      isValid: 'true',
    };
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const inputNode = this.inputRef.current;
    inputNode.select();

    document.addEventListener('keydown', this.onEscapePress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscapePress);
  }

  onEscapePress = ({ keyCode }) => {
    if (keyCode === 27) {
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
    const { onClose } = this.props;
    const { value, isValid } = this.state;

    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          placeholder="Введите название точки"
          value={value}
          onChange={this.onInputChange}
          name="pointName"
          ref={this.inputRef}
          autoComplete="off"
        />
        <Button type="submit" text="Сохранить" disabled={!isValid} />
        <Button onClick={onClose} text="Отмена" />
      </form>
    );
  }
}

export default Form;
