import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  x: string;
  y: string;
  content: string;
  isContainShip: boolean;
  isContainShot: boolean;
  visible: boolean;
  action: Function;
}

export class Cell extends Component<IProps, {}> {
  render(): ReactNode {
    const cellClasses = ['field__cell'];

    if (this.props.isContainShip && this.props.visible)
      cellClasses.push('field__cell-ship');
    if (this.props.isContainShot) {
      cellClasses.push('field__cell-shot');
    }

    if (this.props.x === '0') {
      return (
        <div className={'field__cell field__cell-left'}>
          {this.props.y === '0' ? '' : this.props.y}
        </div>
      );
    } else if (this.props.y === '0') {
      return (
        <div className={'field__cell field__cell-top'}>
          {this.props.x === '0' ? '' : this.props.x}
        </div>
      );
    }
    return (
      <div
        className={cellClasses.join(' ')}
        onClick={() => this.props.action(this.props.x, this.props.y)}
      >
        {this.props.content}
      </div>
    );
  }
}
