import * as Location from "expo-location";
import { Href, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { PanResponder, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useLocationState } from "@/contexts/location-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useEvent } from "react-native-reanimated";
import ContentCard from "./ContentCard";
import TopBar from "./TopBar";

type TabName = "currently" | "today" | "weekly";

type WeatherTabScreenProps = {
  tab: TabName;
  title: string;
  subtitle: string;
};

const TAB_ORDER: TabName[] = ["currently", "today", "weekly"];

const TAB_PATHS: Record<TabName, Href> = {
  currently: "/(tabs)/currently",
  today: "/(tabs)/today",
  weekly: "/(tabs)/weekly",
};

const SWIPE_THRESHOLD = 60;

export function WeatherTabScreen({
  tab,
  title,
  subtitle,
}: WeatherTabScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    searchText,
    setSearchText,
    locationText,
    setLocationText,
    isLocating,
    setIsLocating,
  } = useLocationState();

  const screenBackground = useThemeColor({}, "background");

  const getLocationFromCoords = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        console.log("Address: " + JSON.stringify(address, null, 2));

        if (
          address?.district ||
          address?.city ||
          address?.region ||
          address?.country
        ) {
          const [district, city, region, country] = [
            address.district,
            address.city,
            address.region,
            address.country,
          ].filter(Boolean);
          return [district, city, region !== city ? region : null, country]
            .filter(Boolean)
            .join(", ");
        }
      } catch (error) {
        console.error("Error reverse geocoding: ", error);
      }
      return null;
    },
    [],
  );

  const detectLocation = useCallback(async () => {
    try {
      setIsLocating(true);

      const isServiceEnabled = await Location.hasServicesEnabledAsync();
      if (!isServiceEnabled) {
        setLocationText("Location services are disabled");
        return;
      }
      {
        /** Permission Check */
      }
      const permission = await Location.requestForegroundPermissionsAsync();
      console.log(
        "Location permission: " + JSON.stringify(permission, null, 2),
      );
      if (permission.status !== "granted" || !permission.granted) {
        setLocationText("No access to location");
        return;
      }
      console.log("Permission Granted!\nDetecting location...");

      {
        /** Get Current Position */
      }
      let position: Location.LocationObject | null = null;
      try {
        position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Lowest,
        });
      } catch {
        position = await Location.getLastKnownPositionAsync();
      }
      console.log("Position: " + JSON.stringify(position, null, 2));

      {
        /** Reverse Geocode and fetching adress data*/
      }
      const address = position
        ? await getLocationFromCoords(
            position.coords.latitude,
            position.coords.longitude,
          )
        : null;
      if (address) {
        setLocationText(address);
        setSearchText(address);
        return;
      }
      setLocationText(
        position!.coords.latitude.toFixed(4) +
          ", " +
          position!.coords.longitude.toFixed(4),
      );
      setSearchText(
        position!.coords.latitude.toFixed(4) +
          ", " +
          position!.coords.longitude.toFixed(4),
      );
    } catch (error) {
      console.error("Error detecting location: ", error);
      setLocationText("Can't determine location");
    } finally {
      setIsLocating(false);
    }
  }, [getLocationFromCoords, setIsLocating, setLocationText, setSearchText]);

  const handleLocationSearch = useCallback(
    (userInput: string) => {
      const normalized = userInput.trim();
      if (!normalized) {
        return;
      }

      // Placeholder until geocoding/weather API is connected.
      setSearchText(normalized);
      setLocationText(normalized);
    },
    [setLocationText, setSearchText],
  );

  useEvent(() => {
    if (locationText) {
      return;
    }
    detectLocation();
  }, [locationText]);

  const swipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > 24 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) < SWIPE_THRESHOLD) {
            return;
          }

          const currentIndex = TAB_ORDER.indexOf(tab);
          if (currentIndex < 0) {
            return;
          }

          const nextIndex =
            gestureState.dx < 0 ? currentIndex + 1 : currentIndex - 1;
          if (nextIndex < 0 || nextIndex >= TAB_ORDER.length) {
            return;
          }

          const nextTab = TAB_ORDER[nextIndex];
          router.replace(TAB_PATHS[nextTab]);
        },
      }),
    [router, tab],
  );

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <ThemedView
        style={[styles.swipeContainer, { paddingTop: insets.top + 6 }]}
        {...swipeResponder.panHandlers}
      >
        <TopBar
          searchText={searchText}
          setSearchText={setSearchText}
          handleLocationSearch={handleLocationSearch}
          detectLocation={detectLocation}
          isLocating={isLocating}
        />

        <ContentCard
          title={title}
          subtitle={subtitle}
          locationText={locationText}
          isLocating={isLocating}
        />
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
