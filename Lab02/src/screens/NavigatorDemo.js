import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NavigatorScreen1 from './NavigatorScreen1';
import NavigatorScreen2 from './NavigatorScreen2';

const Stack = createNativeStackNavigator();

/**
 * Exercise 2 (PDF Slide 3): Stack Navigator Demo
 * Điều hướng Stack giữa Screen1 và Screen2
 * Sử dụng NavigationContainer với independent={true} để hoạt động độc lập
 */
export default function NavigatorDemo() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Screen1"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#333333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Screen1"
          component={NavigatorScreen1}
          options={{ title: 'Screen1' }}
        />
        <Stack.Screen
          name="Screen2"
          component={NavigatorScreen2}
          options={{ title: 'Screen2' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
