import * as Location from 'expo-location';
import { Href, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { PanResponder, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useLocationState } from '@/contexts/location-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import TopBar from './TopBar';
import ContentCard from './ContentCard';

type TabName = 'currently' | 'today' | 'weekly';

type WeatherTabScreenProps = {
  tab: TabName;
  title: string;
  subtitle: string;
};

const TAB_ORDER: TabName[] = ['currently', 'today', 'weekly'];

const TAB_PATHS: Record<TabName, Href> = {
  currently: '/(tabs)/currently',
  today: '/(tabs)/today',
  weekly: '/(tabs)/weekly',
};

const SWIPE_THRESHOLD = 60;

export function WeatherTabScreen({ tab, title, subtitle }: WeatherTabScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { searchText, setSearchText, locationText, setLocationText, isLocating, setIsLocating } =
    useLocationState();

  const screenBackground = useThemeColor({}, 'background');

  const detectLocation = useCallback(async () => {
    try {
      setIsLocating(true);
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        setLocationText('No access to location');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [address] = await Location.reverseGeocodeAsync(position.coords);
      
      console.log(JSON.stringify(address, null, 2));
      console.log(JSON.stringify(position.coords));  

      if (address?.district || address?.city || address?.region || address?.country) {
        const [district, city, region, country] = [address.district, address.city, address.region, address.country].filter(Boolean);
        const locationName = [district, city, region !== city ? region : null, country].filter(Boolean).join(', ');

        setLocationText(locationName);
        setSearchText(locationName);
        return;
      }
    } catch {
      setLocationText('Can\'t determine location');
    } finally {
      setIsLocating(false);
    }
  }, [setIsLocating, setLocationText, setSearchText]);

  const handleLocationSearch = useCallback((userInput: string) => {
    const normalized = userInput.trim();
    if (!normalized) {
      return;
    }

    // Placeholder until geocoding/weather API is connected.
    setSearchText(normalized);
    setLocationText(normalized);
  }, [setLocationText, setSearchText]);

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 24 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) < SWIPE_THRESHOLD) {
            return;
          }

          const currentIndex = TAB_ORDER.indexOf(tab);
          if (currentIndex < 0) {
            return;
          }

          const nextIndex = gestureState.dx < 0 ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) {
            return;
          }

          const nextTab = TAB_ORDER[nextIndex];
          router.replace(TAB_PATHS[nextTab]);
        },
      }),
    [router, tab]
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBackground }]}>
      <ThemedView
        style={[styles.swipeContainer, { paddingTop: insets.top + 6 }]}
        {...swipeResponder.panHandlers}>

        <TopBar
          searchText={searchText}
          setSearchText={setSearchText}
          handleLocationSearch={handleLocationSearch}
          detectLocation={detectLocation}
          isLocating={isLocating}
        />
        
        <ContentCard title={title} subtitle={subtitle} locationText={locationText} isLocating={isLocating} />

      </ThemedView>
    </ThemedView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swipeContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 14,
  },
});
