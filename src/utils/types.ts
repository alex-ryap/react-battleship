export type Player = {
  name: string;
  field: Array<Square>;
  isInstalledShips: boolean;
  numberOfShips: number;
};

export type Shot = {
  x: string;
  y: string;
};

export type Square = {
  x: string;
  y: string;
  content: string;
  isContainShip: boolean;
  isContainShot: boolean;
};
