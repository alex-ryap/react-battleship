import { FieldItem } from '../components/Field';

export type Player = {
  name: string;
  field: Array<FieldItem>;
  isInstalledShips: boolean;
  numberOfShips: number;
};

export type Shot = {
  x: string;
  y: string;
};
