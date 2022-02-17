import { Component, ReactNode } from 'react';
import './style.scss';

interface IProps {
  text: string;
  status?: boolean;
  onClick: Function;
}

export class Button extends Component<IProps, {}> {
  render(): ReactNode {
    return (
      <button
        className="btn"
        onClick={() => this.props.onClick()}
        disabled={this.props.status}
      >
        {this.props.text}
      </button>
    );
  }
}
