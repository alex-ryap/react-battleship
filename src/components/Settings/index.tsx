import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  numberPlayer: number;
  children?: ReactNode;
}

export class Settings extends Component<IProps, {}> {
  render(): ReactNode {
    return (
      <div className="game__settings">
        <div className="game__buttons">{this.props.children}</div>
        <h2>Player{this.props.numberPlayer}</h2>
      </div>
    );
  }
}
