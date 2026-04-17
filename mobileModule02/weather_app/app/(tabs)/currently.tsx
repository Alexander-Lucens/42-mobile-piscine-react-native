import React from 'react';

import { WeatherTabScreen } from '@/components/WeatherTabScreen';

export default function CurrentScreen() {
  return <WeatherTabScreen tab="currently" title="Currently" subtitle="Current Weather" />;
}
