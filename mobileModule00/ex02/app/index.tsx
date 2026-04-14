import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';

function removeLastCharInInput({input, setInput}) {
  const len = input.length;
  if (len === 1) {
    setInput('0');
    return;
  }
  setInput((prev: string) => prev.slice(0, len - 1));
}

function removeAllInput({setInput}) {
  setInput('0');
}

function addition({input, setInput, values, setValues}) {
  setInput('0');
}

const operations = new Map<string, Function>();

operations.set("C", removeLastCharInInput);
operations.set("AC", removeAllInput);
operations.set("+", removeLastCharInInput);
operations.set("-", removeLastCharInInput);
operations.set("*", removeLastCharInInput);
operations.set("/", removeLastCharInInput);
operations.set("=", removeLastCharInInput);

function Key({value, input, setInput, values, setValues}) {
  
  return (
    <Pressable
      style={styles.keyboardKey}
      onPress={() => {
        if (operations.has(value)) {
          const operation = operations.get(value);
          if (operation) {
            operation({input, setInput, values, setValues})
          }
        } else if (input === '0') {
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

function Keyboard({input, setInput, values, setValues}) {

  return (
    <View style={styles.keyboardGrid}>
      <View style={styles.keyboardGridRow}>
        <Key value='7' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='8' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='9' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='C' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='AC' input={input} setInput={setInput} values={values} setValues={setValues} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='4' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='5' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='6' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='+' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='-' input={input} setInput={setInput} values={values} setValues={setValues} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='1' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='2' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='3' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='*' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='/' input={input} setInput={setInput} values={values} setValues={setValues} />
      </View>
      <View style={styles.keyboardGridRow}>
        <Key value='0' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='.' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='00' input={input} setInput={setInput} values={values} setValues={setValues} />
        <Key value='=' input={input} setInput={setInput} values={values} setValues={setValues} />
      </View>
      
    </View>
  );
}

export default function ModalScreen() {
  const [values, setValues] = useState([]);
  const [inputText, setInputText] = useState('0');

  return (
    <>
      <Stack.Screen options={{ title: 'Calculator' }} />
      
        <View style={styles.calcScreen}>
          <Text style={styles.calcScreenText}>{inputText}</Text>
        </View>
        <Keyboard
          input={inputText}
          setInput={setInputText}
          values={values}
          setValues={setValues}
          />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  calcScreen: {
    backgroundColor: 'rgb(99, 99, 99)',
    fontSize: 30,
    width: '100%',
    height: '40%',
    padding: 10
  },
  calcScreenText: {
    color: 'white',
    fontSize: 30,
    width: '100%',
    height: '40%',
    textAlign: 'right'
  },
  keyboardGrid: {
    backgroundColor: 'rgb(0, 75, 85)',
    color: 'white',
    fontSize: 30,
    width: '100%',
    height: '40%',
    textAlign: 'right',
  },
  keyboardGridRow: {
    flexDirection: 'row',
    height: '25%',
  },
  keyboardKey: {
    // backgroundColor: 'rgb(0, 75, 85)',
    fontSize: 30,
    width: '20%',
    alignItems: 'center',
    padding: '2.5%',
    
  },
  keyboardKeyText: {
    color: 'white',
    fontSize: 30,
  },
});