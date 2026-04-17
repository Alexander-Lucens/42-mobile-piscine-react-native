import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

function CapitaliseFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ContentCard({ title, subtitle, locationText, isLocating }: { title: string; subtitle: string; locationText: string; isLocating: boolean }) {
  const screenBackground = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <ThemedView style={[styles.contentCard, { backgroundColor: screenBackground }]}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: iconColor }]}>{subtitle}</ThemedText>

        <ThemedView style={styles.locationRow}>
        <MaterialIcons name="location-on" size={18} color={tintColor} />
        <ThemedText style={styles.locationText}>{CapitaliseFirstLetter(locationText)}</ThemedText>
        {isLocating ? <ActivityIndicator size="small" color={tintColor} /> : null}
        </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contentCard: {
    flex: 1,
    gap: 10,
  },
  title: {
    paddingTop: 10,
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
