import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LoginScreen from './LoginScreen';
import ShoppingCartScreen from './ShoppingCartScreen';

/**
 * Màn hình tích hợp Login & ShoppingCart từ tài liệu thực hành mở rộng (28_09_2026.docx)
 */
export default function AuthCartDemo() {
  const [activeScreen, setActiveScreen] = useState('login');

  return (
    <View style={styles.container}>
      {/* Sub-header chuyển đổi nhanh giữa Login và Cart */}
      <View style={styles.subBar}>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeScreen === 'login' && styles.subTabActive,
          ]}
          onPress={() => setActiveScreen('login')}
        >
          <Text
            style={[
              styles.subTabText,
              activeScreen === 'login' && styles.subTabTextActive,
            ]}
          >
            1. Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.subTab,
            activeScreen === 'cart' && styles.subTabActive,
          ]}
          onPress={() => setActiveScreen('cart')}
        >
          <Text
            style={[
              styles.subTabText,
              activeScreen === 'cart' && styles.subTabTextActive,
            ]}
          >
            2. Shopping Cart
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activeScreen === 'login' ? (
          <LoginScreen onLoginSuccess={() => setActiveScreen('cart')} />
        ) : (
          <ShoppingCartScreen />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  subBar: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    padding: 6,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  subTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  subTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
  },
  subTabTextActive: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
});
