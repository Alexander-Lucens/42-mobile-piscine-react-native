import { View, Text } from 'react-native';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { styles } from './styles';
import Keyboard from '../components/Keyboard';

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
