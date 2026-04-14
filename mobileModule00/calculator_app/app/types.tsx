import { type Dispatch, type SetStateAction } from 'react';


export type SetString = Dispatch<SetStateAction<string>>;

export type CalculatorActionPayload = {
  input: string;
  setInput: SetString;
  valueStr: string;
  setValueStr: SetString;
};

export type KeyProps = {
  value: string;
  input: string;
  setInput: SetString;
  valueStr: string;
  setValueStr: SetString;
};

export type Operator = '+' | '-' | '*' | '/';