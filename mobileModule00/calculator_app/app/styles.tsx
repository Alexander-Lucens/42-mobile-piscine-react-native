import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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