import { operations } from "@/components/Keyboard";
import { styles } from "@/app/styles";
import { Text, Pressable } from "react-native";
import { KeyProps } from "@/types";

function getLastIndexOfOperation(input: string) {
  return Math.max(
	input.lastIndexOf('+'),
	input.lastIndexOf('-'),
	input.lastIndexOf('*'),
	input.lastIndexOf('/'),
  );
}

function shouldIgnoreInput(value: string, input: string): boolean {
  if (!value) {
	return true;
  }
  const lastOperationIndex = getLastIndexOfOperation(input);
  const isZeroKey = value === '0' || value === '00';
  const operand = input.slice(lastOperationIndex + 1);
  if (!isZeroKey) { 
	return false;
  }
  if (operand.includes('.') || /[1-9]/.test(operand)) {
	return false;
  }
  value = '0';
  return Number(operand) === 0 && operand !== '';
}

export default function Key({ value, input, setInput, valueStr, setValueStr }: KeyProps) {
  return (
	<Pressable
	  style={styles.keyboardKey}
	  onPress={() => {
		if (shouldIgnoreInput(value, input)) {
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
		  const lastIndex = getLastIndexOfOperation(input);
		  if (lastIndex === input.length - 1 && value === '00') {
			value = '0';
		  }
		  if (input.slice(lastIndex + 1) === '0' && value !== '.') {
			setInput(input.slice(0, lastIndex + 1) + value);
		  } else {
			setInput((prev: string) => prev + value);
		  }
		}
	  }}
	>
	  <Text style={styles.keyboardKeyText}>{value}</Text>
	</Pressable>
  );
}