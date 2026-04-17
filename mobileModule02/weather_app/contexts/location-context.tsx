import React, { createContext, useContext, useMemo, useState } from 'react';

type LocationContextValue = {
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  locationText: string;
  setLocationText: React.Dispatch<React.SetStateAction<string>>;
  isLocating: boolean;
  setIsLocating: React.Dispatch<React.SetStateAction<boolean>>;
};

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState('');
  const [locationText, setLocationText] = useState('Detecting location...');
  const [isLocating, setIsLocating] = useState(false);

  const value = useMemo(
    () => ({
      searchText,
      setSearchText,
      locationText,
      setLocationText,
      isLocating,
      setIsLocating,
    }),
    [searchText, locationText, isLocating]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationState() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationState must be used inside LocationProvider');
  }

  return context;
}
