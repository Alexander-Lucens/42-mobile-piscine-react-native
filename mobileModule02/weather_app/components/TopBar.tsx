import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TopBar({
  searchText,
  setSearchText,
    handleLocationSearch, 
    detectLocation,
    isLocating }: {
    searchText: string;
    setSearchText: (value: string) => void;
        handleLocationSearch: (input: string) => void;
        detectLocation: () => Promise<void>;
        isLocating: boolean
    }) {
    const screenBackground = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');
    const iconColor = useThemeColor({}, 'icon');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'borderColor');
    const cardColor = useThemeColor({}, 'card');

    return (
        <ThemedView style={[styles.topBar, { borderColor, backgroundColor: cardColor }]}>
          <ThemedView style={[styles.searchContainer, { borderColor, backgroundColor: screenBackground }]}>
            <MaterialIcons name="search" size={20} color={iconColor} />
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Enter city"
              placeholderTextColor={iconColor}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              onSubmitEditing={() => {
                handleLocationSearch(searchText);
              }}
            />
          </ThemedView>

          <Pressable
            style={[styles.locationButton, { borderColor, backgroundColor: screenBackground }]}
            onPress={() => {
              void detectLocation();
            }}
            disabled={isLocating}
            accessibilityLabel="Detecting current location"
            accessibilityHint="Requests permission to access location and detects current city"
            accessibilityRole="button"
            accessibilityState={{ busy: isLocating }}>
            <MaterialIcons name="my-location" size={20} color={tintColor} />
          </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
  topBar: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
