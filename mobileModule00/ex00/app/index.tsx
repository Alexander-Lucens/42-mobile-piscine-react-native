import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function ModalScreen() {

  const handlePress = () => {
    console.log('Button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>A  Simple Text</Text>
      <Pressable
        style={styles.button}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>Click me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: {
    backgroundColor: 'rgb(128, 128, 40)',
    color: 'white',
    padding: 8,
    borderRadius: 6,
    fontSize: 20,
    margin: 10,
  },
  button: {
    backgroundColor: '#eeeeee',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5
  },
  buttonText: {
    color: 'rgb(128, 128, 40)',
    fontWeight: '600',
  },
});