import React from 'react';

import { WeatherTabScreen } from '@/components/WeatherTabScreen';

export default function CurrentScreen() {
  return <WeatherTabScreen tab="current" title="Current" subtitle="Current Weather" />;
}
