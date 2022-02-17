import { FieldItem } from '../components/Field';

export const splitToRows = (arr: Array<FieldItem>): Array<Array<FieldItem>> => {
  const subArrays = [];

  for (let i = 0; i < arr.length; ) {
    const end = i + 6;
    subArrays.push(arr.slice(i, end));
    i = end;
  }

  return subArrays;
};
