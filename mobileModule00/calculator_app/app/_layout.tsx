import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Layout() {
  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        <Stack
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: '#004ba1' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '700' },
            headerTitleAlign: 'center',
          }}
        />
      </View>
      <View pointerEvents="none" style={styles.footerLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
  },
  footerLine: {
    height: 20,
    backgroundColor: '#000000',
  },
});