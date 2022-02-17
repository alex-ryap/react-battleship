import { Component, ReactNode } from 'react';
import { splitToRows } from '../../utils/commons';
import { FieldRow } from '../FieldRow';
import './style.scss';

export type FieldItem = {
  x: string;
  y: string;
  content: string;
  ship: boolean;
  shot: boolean;
};

interface IProps {
  field: Array<FieldItem>;
  visible: boolean;
  addShip: Function;
}

export class Field extends Component<IProps, {}> {
  render(): ReactNode {
    const rows = splitToRows(this.props.field);

    return (
      <div className="field">
        {rows.map((row, index) => {
          return (
            <FieldRow
              key={index}
              squares={row}
              visible={this.props.visible}
              addShip={this.props.addShip}
            />
          );
        })}
      </div>
    );
  }
}
