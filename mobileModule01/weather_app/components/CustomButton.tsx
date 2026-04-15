import { Pressable, StyleSheet } from "react-native";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from "react-native";


export default function CustomButton(props: { icon: string; text: string; action: Function; }) {

	const { icon, text, action } = props;


	return (
		<Pressable style={styles.container} onPress={() => action()} >
			<Icon name="arrow-right" size={30} color="black" />
			{text.length !== 0 && <Text>{text}</Text> }
		</Pressable>
	);
}

const styles = StyleSheet.create({
  container: {
	height: 60,
	width: 60,
	backgroundColor: 'white',
	padding: 10
  },
});