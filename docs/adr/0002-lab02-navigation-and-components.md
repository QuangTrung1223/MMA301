# Unified Expo App with React Navigation, SectionList, and Drawer for Lab02

## Context
Lab 2 introduces core advanced UI and navigation patterns in React Native (MMA301):
1. **SectionList**: Categorized list rendering with section headers and item rows.
2. **Stack Navigation**: Multi-screen navigation with parameter passing (`Screen1` -> `Screen2` with `{ name }`).
3. **DrawerLayoutAndroid**: Native slide-out side drawer with toggle actions.
4. **SafeAreaView**: Device-agnostic safe area insetting.
5. **Integrated Layouts**: The accompanying `28_09_2026` assignment reinforces `LoginScreen` and `ShoppingCartScreen`.

## Decision
We create a standalone Expo project in `Lab02/` featuring:
1. `@react-navigation/native` and `@react-navigation/native-stack` to handle true Stack Navigation (`Screen1` -> `Screen2` passing `{ name }`).
2. A direct implementation of `DrawerLayoutAndroid` matching the course slide specifications, supplemented with a cross-platform fallback for iOS and Web environments.
3. Clean separation of exercises into modular screens in `src/screens/`:
   - `SectionListScreen.js`
   - `NavigationScreen1.js` & `NavigationScreen2.js`
   - `DrawerScreen.js`
   - `SafeAreaScreen.js`
   - `LoginScreen.js` & `ShoppingCartScreen.js`
4. A root tab/hub navigator that enables graders to switch effortlessly between all demo exercises and view both isolated components and full application flows.

## Consequences
- Graders can assess each exact slide exercise independently without needing separate apps.
- The project runs seamlessly on Android, iOS, and Web simulators.
- Establishes idiomatic patterns for navigation props and route parameters in React Native.
