import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  playerName: string;
  actionInfo?: string;
  children?: ReactNode;
}

export class UserAction extends Component<IProps, {}> {
  render(): ReactNode {
    return (
      <div className="game__settings">
        <h2>{this.props.playerName}</h2>
        <p className="game__text">{this.props.actionInfo}</p>
        <div className="game__buttons">{this.props.children}</div>
      </div>
    );
  }
}
