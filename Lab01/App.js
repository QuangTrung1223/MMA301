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
import LoginScreen from './src/screens/LoginScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import TaskManagerScreen from './src/screens/TaskManagerScreen';

/**
 * Ứng dụng chính Lab01 - Môn MMA301
 * Tích hợp toàn diện:
 * 1. LoginScreen (Xác thực dữ liệu form, kiểm tra lỗi thời gian thực)
 * 2. ShoppingCartScreen (Quản lý giỏ hàng, số lượng, chọn sản phẩm, tính tổng tiền)
 * 3. TaskManagerScreen (Quản lý công việc Todo List, lọc, đánh dấu hoàn thành)
 */
export default function App() {
  // Quản lý màn hình hiện tại đang hiển thị ('login' | 'cart' | 'tasks')
  const [currentScreen, setCurrentScreen] = useState('login');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Thanh chuyển đổi màn hình (Tab Switcher) */}
      <HeaderNav
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
      />

      {/* Hiển thị màn hình tương ứng */}
      <View style={styles.screenContainer}>
        {currentScreen === 'login' && (
          <LoginScreen onLoginSuccess={() => setCurrentScreen('cart')} />
        )}
        {currentScreen === 'cart' && <ShoppingCartScreen />}
        {currentScreen === 'tasks' && <TaskManagerScreen />}
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
