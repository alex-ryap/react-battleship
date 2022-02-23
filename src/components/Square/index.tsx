import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  x: string;
  y: string;
  content: string;
  ship: boolean;
  shot: boolean;
  visible: boolean;
  action: Function;
}

export class Square extends Component<IProps, {}> {
  render(): ReactNode {
    const squareClasses = ['field__square'];

    if (this.props.ship && this.props.visible)
      squareClasses.push('field__square-ship');
    if (this.props.shot) {
      squareClasses.push('field__square-shot');
    }

    if (this.props.x === '0') {
      return (
        <div className={'field__square field__square-left'}>
          {this.props.y === '0' ? '' : this.props.y}
        </div>
      );
    } else if (this.props.y === '0') {
      return (
        <div className={'field__square field__square-top'}>
          {this.props.x === '0' ? '' : this.props.x}
        </div>
      );
    }
    return (
      <div
        className={squareClasses.join(' ')}
        onClick={() => this.props.action(this.props.x, this.props.y)}
      >
        {this.props.content}
      </div>
    );
  }
}
