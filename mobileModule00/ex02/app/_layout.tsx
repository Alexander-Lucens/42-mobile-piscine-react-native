import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#004ba1' },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: { fontWeight: '700' },
      headerTitleAlign: 'center',
    }} />;
}