import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  x: string;
  y: string;
  content: string;
  ship: boolean;
  shot: boolean;
  visible: boolean;
  addShip: Function;
}

export class Square extends Component<IProps, {}> {
  render(): ReactNode {
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
        className={
          this.props.ship && this.props.visible
            ? 'field__square field__square-ship'
            : 'field__square'
        }
        onClick={() => this.props.addShip(this.props.x, this.props.y)}
      >
        {this.props.content}
      </div>
    );
  }
}
