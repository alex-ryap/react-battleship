import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  numberPlayer: number;
  shotResult?: string;
  children?: ReactNode;
}

export class Settings extends Component<IProps, {}> {
  render(): ReactNode {
    return (
      <div className="game__settings">
        <h2>Игрок{this.props.numberPlayer}</h2>
        <p className="game__text">{this.props.shotResult}</p>
        <div className="game__buttons">{this.props.children}</div>
      </div>
    );
  }
}
