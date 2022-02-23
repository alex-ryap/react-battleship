import { Component, ReactNode } from 'react';
import { FieldItem } from '../Field';
import { Square } from '../Square';
import './style.scss';

interface Props {
  squares: Array<FieldItem>;
  visible: boolean;
  action: Function;
}

export class FieldRow extends Component<Props, {}> {
  render(): ReactNode {
    return (
      <div className="field__row">
        {this.props.squares.map((square) => {
          return (
            <Square
              key={square.x + square.y}
              x={square.x}
              y={square.y}
              content={square.content}
              ship={square.ship}
              shot={square.shot}
              visible={this.props.visible}
              action={this.props.action}
            />
          );
        })}
      </div>
    );
  }
}
