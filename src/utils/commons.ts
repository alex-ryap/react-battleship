import { Square } from './types';

export const splitToRows = (arr: Array<Square>): Array<Array<Square>> => {
  const subArrays = [];

  for (let i = 0; i < arr.length; ) {
    const end = i + 6;
    subArrays.push(arr.slice(i, end));
    i = end;
  }

  return subArrays;
};
