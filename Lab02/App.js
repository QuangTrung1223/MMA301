import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import HeaderNav from './src/components/HeaderNav';
import SectionListComp from './src/screens/SectionListComp';
import NavigatorDemo from './src/screens/NavigatorDemo';
import DrawerLayoutAndroidComp from './src/screens/DrawerLayoutAndroidComp';
import SafeAreaViewComp from './src/screens/SafeAreaViewComp';
import AuthCartDemo from './src/screens/AuthCartDemo';

/**
 * Ứng dụng chính Lab02 - Môn MMA301
 * Tích hợp toàn diện các bài thực hành:
 * 1. SectionList (Danh sách phân nhóm theo danh mục)
 * 2. Navigator (React Navigation Stack truyền tham số { name } và goBack)
 * 3. DrawerLayoutAndroid (Menu ngăn kéo trượt gốc Android với toggle button)
 * 4. SafeAreaView (Xử lý an toàn cho màn hình có tai thỏ / notch)
 * 5. Login & Shopping Cart (Giao diện chuẩn hóa từ bài tập mở rộng)
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('sectionList');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Thanh chuyển đổi bài thực hành */}
      <HeaderNav
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
      />

      {/* Vùng hiển thị màn hình tương ứng */}
      <View style={styles.screenContainer}>
        {currentScreen === 'sectionList' && <SectionListComp />}
        {currentScreen === 'navigator' && <NavigatorDemo />}
        {currentScreen === 'drawer' && <DrawerLayoutAndroidComp />}
        {currentScreen === 'safeArea' && <SafeAreaViewComp />}
        {currentScreen === 'authCart' && <AuthCartDemo />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  screenContainer: {
    flex: 1,
  },
});
