import { Component, ReactNode } from 'react';
import { Square } from '../../utils/types';
import { Cell } from '../Cell';
import './style.scss';

interface Props {
  squares: Array<Square>;
  visible: boolean;
  action: Function;
}

export class FieldRow extends Component<Props, {}> {
  render(): ReactNode {
    return (
      <div className="field__row">
        {this.props.squares.map((square) => {
          return (
            <Cell
              key={square.x + square.y}
              x={square.x}
              y={square.y}
              content={square.content}
              isContainShip={square.isContainShip}
              isContainShot={square.isContainShot}
              visible={this.props.visible}
              action={this.props.action}
            />
          );
        })}
      </div>
    );
  }
}
