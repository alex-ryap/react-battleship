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
  playerName: string;
  visible: boolean;
  action: Function;
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
              action={this.props.action}
            />
          );
        })}
        <div className="field__name">{this.props.playerName}</div>
      </div>
    );
  }
}
