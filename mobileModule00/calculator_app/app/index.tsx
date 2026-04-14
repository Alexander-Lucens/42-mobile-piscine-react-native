import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useState, type Dispatch, type SetStateAction } from 'react';

type SetString = Dispatch<SetStateAction<string>>;

type CalculatorActionPayload = {
  input: string;
  setInput: SetString;
  valueStr: string;
  setValueStr: SetString;
};

type KeyProps = {
  value: string;
  input: string;
  setInput: SetString;
  valueStr: string;
  setValueStr: SetString;
};

function removeLastCharInInput({ input, setInput, setValueStr }: CalculatorActionPayload) {
  const len = input.length;
  if (len === 1) {
    setInput('0');
    setValueStr('0');
    return;
  }
  setInput((prev: string) => prev.slice(0, len - 1));
}

function removeAllInput({ setInput, setValueStr }: CalculatorActionPayload) {
  setInput('0');
  setValueStr('0');
}

type Operator = '+' | '-' | '*' | '/';

function isOperator(char: string): char is Operator {
  return char === '+' || char === '-' || char === '*' || char === '/';
}

function tokenizeExpression(input: string): (number | Operator)[] {
  const tokens: (number | Operator)[] = [];
  let i = 0;
  let expectNumber = true;

  while (i < input.length) {
    const char = input[i];

    if (expectNumber) {
      let sign = 1;

      while (i < input.length && (input[i] === '+' || input[i] === '-')) {
        if (input[i] === '-') {
          sign *= -1;
        }
        i += 1;
      }

      let numberLiteral = '';
      while (i < input.length && (/[0-9.]/).test(input[i])) {
        numberLiteral += input[i];
        i += 1;
      }

      if (!numberLiteral) {
        throw new Error('Invalid number');
      }

      const value = Number.parseFloat(numberLiteral);
      if (!Number.isFinite(value)) {
        throw new Error('Invalid number');
      }

      tokens.push(sign * value);
      expectNumber = false;
      continue;
    }

    if (!isOperator(char)) {
      throw new Error('Invalid operator');
    }

    tokens.push(char);
    i += 1;
    expectNumber = true;
  }

  if (expectNumber) {
    throw new Error('Expression ends with operator');
  }

  return tokens;
}

function evaluateExpression(input: string): number {
  const tokens = tokenizeExpression(input);
  const values: number[] = [];
  const plusMinusOps: ('+' | '-')[] = [];

  let currentValue = tokens[0] as number;

  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i] as Operator;
    const nextValue = tokens[i + 1] as number;

    if (operator === '*') {
      currentValue *= nextValue;
      continue;
    }

    if (operator === '/') {
      if (nextValue === 0) {
        throw new Error('Division by zero');
      }
      currentValue /= nextValue;
      continue;
    }

    values.push(currentValue);
    plusMinusOps.push(operator);
    currentValue = nextValue;
  }

  values.push(currentValue);

  let result = values[0];
  for (let i = 0; i < plusMinusOps.length; i += 1) {
    result = plusMinusOps[i] === '+' ? result + values[i + 1] : result - values[i + 1];
  }

  return result;
}

function handleCalculation({ input, setInput, valueStr, setValueStr  }: CalculatorActionPayload) {
  try {
    const result = evaluateExpression(input);
    setValueStr(result.toString());
  } catch (error) {
    console.error('Error calculating execution tree:', error);
    setValueStr('Error');
  }
}

const operations = new Map<string, (payload: CalculatorActionPayload) => void>();

function handleAddition({ input, setInput, valueStr, setValueStr }: CalculatorActionPayload) {
  if(operations.has(input.slice(-1))) {
    input = input.slice(0, -1);
  }
  setInput(input + '+');
}

function handleSubtraction({ input, setInput, valueStr, setValueStr }: CalculatorActionPayload) {
  if(input.slice(-1) === '-') {
    return;
  }
  setInput(input + '-');
}

function handleMultiplication({ input, setInput, valueStr, setValueStr }: CalculatorActionPayload) {
  if(operations.has(input.slice(-1))) {
    input = input.slice(0, -1);
  }
  setInput(input + '*');
}

function handleDivision({ input, setInput, valueStr, setValueStr }: CalculatorActionPayload) {
  if(operations.has(input.slice(-1))) {
    input = input.slice(0, -1);
  }
  setInput(input + '/');
}

operations.set("C", removeLastCharInInput);
operations.set("AC", removeAllInput);
operations.set("=", handleCalculation);
operations.set("+", handleAddition);
operations.set("-", handleSubtraction);
operations.set("*", handleMultiplication);
operations.set("/", handleDivision);

function Key({ value, input, setInput, valueStr, setValueStr }: KeyProps) {
  
  return (
    <Pressable
      style={styles.keyboardKey}
      onPress={() => {
        if (!value || input === '0' && (value === '0' || value === '00')) {
          return;
        }

        if (operations.has(value)) {
          const operation = operations.get(value);
          if (operation) {
            operation({input, setInput, valueStr, setValueStr})
          }
        } else if (input === '0' && value !== '.') {
          setInput(value);
        } else {
          setInput((prev: string) => prev + value);
        }
      }}
    >
      <Text style={styles.keyboardKeyText}>{value}</Text>
    </Pressable>
  );
}

function Keyboard({ input, setInput, valueStr, setValueStr }: Omit<KeyProps, 'value'>) {

  return (
    <View style={styles.keyboardGrid}>
      <View style={styles.keyboardGridRow}>
        <Key value='7' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='8' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='9' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='C' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='AC' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='4' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='5' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='6' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='+' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='-' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='1' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='2' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='3' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='*' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='/' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='0' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='.' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='00' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='=' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
        <Key value='' input={input} setInput={setInput} valueStr={valueStr} setValueStr={setValueStr} />
      </View>
      
    </View>
  );
}

export default function ModalScreen() {
  const [valueStr, setValueStr] = useState('0');
  const [inputText, setInputText] = useState('0');

  return (
    <>
      <Stack.Screen options={{ title: 'Calculator' }} />

      <View style={styles.container}>
        <View style={styles.calcScreen}>
          <Text style={styles.calcScreenText}>{inputText}</Text>
          <Text style={styles.calcScreenText}>{valueStr}</Text>
        </View>

        <View style={styles.keyboardWrapper}>
          <Keyboard
          input={inputText}
          setInput={setInputText}
          valueStr={valueStr}
          setValueStr={setValueStr}
          />
        </View>
      </View>

      <Stack.Screen />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
  },
  calcScreen: {
    backgroundColor: 'rgb(99, 99, 99)',
    width: '100%',
    flex: 4,
    padding: 5,
  },
  calcScreenText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'right'
  },
  keyboardWrapper: {
    width: '100%',
    flex: 6,
  },
  keyboardGrid: {
    backgroundColor: 'rgb(0, 75, 85)',
    color: 'white',
    fontSize: 30,
    width: '100%',
    height: '100%',
    textAlign: 'right',
  },
  keyboardGridRow: {
    flexDirection: 'row',
    flex: 1,
  },
  keyboardKey: {
    fontSize: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgb(0, 67, 73)',
    borderWidth: 1,
    
  },
  keyboardKeyText: {
    color: 'white',
    fontSize: 30,
  },
});