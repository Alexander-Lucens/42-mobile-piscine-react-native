# GUIDE: Weather App с нижними табами, верхним баром, геолокацией и свайпами

Этот файл — детальный разбор того, как собрать приложение, которое ты попросил:

- нижний Tab Bar на 3 вкладки
- верхний бар с поиском + иконкой геолокации
- автоопределение местоположения
- переключение табов свайпом влево/вправо
- единый переиспользуемый экран для всех вкладок

Ниже путь с нуля, начиная с `npx create-expo-app`.

---

## 1. Что мы строим

Итоговая UX-модель:

1. Внизу: `Current`, `Today`, `Weekly`.
2. Сверху: строка поиска и кнопка `my-location`.
3. При входе экран запрашивает геолокацию и показывает город/регион.
4. По тапу на иконку геолокации повторно обновляет местоположение.
5. Свайп влево/вправо переключает вкладки.

Главная идея архитектуры:

- роутинг и нижние вкладки делает `expo-router`
- весь UI экрана и логика свайпа/геолокации живут в одном компоненте
- вкладки только подставляют параметры (название/подзаголовок)

---

## 2. Старт проекта с нуля

### 2.1 Создать проект

```bash
npx create-expo-app weather_app
cd weather_app
```

### 2.2 Установить зависимости

```bash
npx expo install expo-router expo-location react-native-gesture-handler react-native-reanimated
npx expo install @expo/vector-icons
```

Почему так:

- `expo-router` — файловая навигация и Tabs
- `expo-location` — доступ к GPS + reverse geocoding
- `gesture-handler` и `reanimated` — база для жестов и плавности
- `@expo/vector-icons` — иконки в табах и верхнем баре

### 2.3 Включить Expo Router (если шаблон не router)

В `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

---

## 3. Рекомендуемая структура папок

```text
app/
  _layout.tsx
  modal.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    current.tsx
    today.tsx
    weekly.tsx
components/
  weather-tab-screen.tsx
  haptic-tab.tsx
constants/
  theme.ts
hooks/
  use-color-scheme.ts
```

Смысл:

- `app/_layout.tsx` — корневой Stack
- `app/(tabs)/_layout.tsx` — нижние Tabs
- `weather-tab-screen.tsx` — общий экран, который переиспользуют все три таба

---

## 4. Роутинг: root layout + tabs layout

### 4.1 Корневой layout

`app/_layout.tsx` должен рендерить только Stack и группу табов как screen:

- `name="(tabs)"`, `headerShown: false`
- optional modal screen отдельно

Почему это важно:

Если положить `<Tabs />` прямо рядом со `<Stack />`, получится конфликт структуры роутера и странное поведение экранов.

### 4.2 Таб layout

`app/(tabs)/_layout.tsx`:

- создаем 3 экрана `current`, `today`, `weekly`
- задаем иконки
- настраиваем стиль таббара
- скрываем `index` через `href: null`

Пример логики скрытия:

- `index` нужен как redirect
- но в таббаре его показывать не надо

---

## 5. Экран по умолчанию

В `app/(tabs)/index.tsx` делаем redirect:

```tsx
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  return <Redirect href="/(tabs)/current" />;
}
```

Это гарантирует, что стартовая вкладка всегда `Current`.

---

## 6. Общий компонент экрана (ключевая часть)

Файл: `components/weather-tab-screen.tsx`

Компонент принимает:

- `tab`: `'current' | 'today' | 'weekly'`
- `title`: заголовок
- `subtitle`: подпись

Содержит:

1. Верхний бар:
   - поле поиска (`TextInput`)
   - кнопка геолокации (`MaterialIcons my-location`)
2. Контент:
   - title/subtitle
   - блок текущей геолокации
   - подсказка про свайп
3. Логику:
   - `detectLocation()`
   - `useEffect` для автозапуска геолокации
   - `PanResponder` для свайпа между вкладками

---

## 7. Геолокация: как сделать правильно

### 7.1 Базовый flow

1. `requestForegroundPermissionsAsync()`
2. если `granted`:
   - `getCurrentPositionAsync()`
   - `reverseGeocodeAsync()`
3. показать `city, region` или координаты fallback

### 7.2 Обработка ошибок

Обязательно обработай:

- пользователь запретил доступ
- геолокация не ответила
- reverse geocoding вернул пусто

### 7.3 Улучшение через app.json

Для iOS/Android лучше явно указать permission messages в `app.json` (через plugin expo-location), чтобы запросы выглядели корректно для пользователя.

---

## 8. Свайп между табами

Используем `PanResponder`:

- проверка, что горизонтальное движение сильнее вертикального
- порог, например `SWIPE_THRESHOLD = 60`
- вычисление следующего индекса вкладки
- переход через `router.replace(TAB_PATHS[nextTab])`

Почему `replace`, а не `push`:

- не раздувает историю навигации
- ощущается как переключение табов, а не переход по deep-link

---

## 9. Как подключить общий экран в каждую вкладку

`app/(tabs)/current.tsx`:

```tsx
import React from 'react';
import { WeatherTabScreen } from '@/components/weather-tab-screen';

export default function CurrentScreen() {
  return <WeatherTabScreen tab="current" title="Current" subtitle="Текущая погода и геолокация" />;
}
```

`today.tsx` и `weekly.tsx` аналогично, только параметры другие.

Плюс такого подхода:

- нет дублирования
- весь UX обновляешь в одном месте

---

## 10. Запуск и проверка

```bash
npm run start
# или
npm run ios
npm run android
```

Проверить руками:

1. Открывается `Current`.
2. Внизу 3 таба.
3. Сверху есть поиск и иконка геолокации.
4. Геолокация подтягивается автоматически.
5. По тапу на иконку обновляется повторно.
6. Свайп влево/вправо переключает табы.

---

## 11. Почему у тебя раньше могли быть ошибки

### Частая ошибка 1: структура router layout

- Tabs в корневом `_layout.tsx` рядом со Stack
- результат: нелогичный роутинг

Решение:

- Stack в `app/_layout.tsx`
- Tabs только в `app/(tabs)/_layout.tsx`

### Частая ошибка 2: JSX runtime

Если в `tsconfig.json` стоит:

```json
"jsx": "react"
```

то нужен `import React from 'react';` в каждом TSX.

Более современный вариант:

```json
"jsx": "react-jsx"
```

тогда явный import React обычно не нужен.

### Частая ошибка 3: index таба светится лишним пунктом

Решение:

- `Tabs.Screen name="index" options={{ href: null }}`
- и redirect на нужную вкладку

---

## 12. Как сделать лучше, чем сейчас

### 12.1 UX

- добавить debounce в поиск (`300-500ms`)
- показать skeleton/loading для погоды
- добавить анимированный переход при свайпе

### 12.2 Архитектура

- вынести геолокацию в хук `useGeoLocation`
- вынести swipe-логику в `useTabSwipe`
- создать typed config для табов

### 12.3 Данные погоды

- подключить API (OpenWeather, WeatherAPI и т.д.)
- кэшировать запросы через React Query
- добавить offline fallback

### 12.4 Качество

- линт + форматтер
- smoke-тесты на навигацию
- E2E-проверки основных сценариев

---

## 13. Мини-чеклист «с нуля до результата»

1. Создать проект `npx create-expo-app`.
2. Поставить `expo-router`, `expo-location`, `vector-icons`.
3. Настроить `main: expo-router/entry`.
4. Сделать `app/_layout.tsx` со Stack.
5. Сделать `app/(tabs)/_layout.tsx` с 3 табами.
6. Сделать redirect из `app/(tabs)/index.tsx` в `current`.
7. Создать `components/weather-tab-screen.tsx`.
8. Подключить экран в `current/today/weekly`.
9. Реализовать `detectLocation()` + ошибки.
10. Реализовать `PanResponder` и switch табов.
11. Прогнать lint и ручную проверку на устройстве.

---

## 14. Краткая карта текущей реализации в этом проекте

- Роутинг Stack: `app/_layout.tsx`
- Роутинг Tabs: `app/(tabs)/_layout.tsx`
- Общий экран с верхним баром + свайпом: `components/weather-tab-screen.tsx`
- Экраны вкладок-обертки: `app/(tabs)/current.tsx`, `app/(tabs)/today.tsx`, `app/(tabs)/weekly.tsx`
- Редирект стартовой вкладки: `app/(tabs)/index.tsx`

---

Если хочешь, следующий шаг — добавим полноценную погодную модель (API, загрузка, ошибки, кеш, состояние поиска) и превратим этот UI в рабочее weather-приложение production-уровня.
