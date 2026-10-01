import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Thanh chuyển đổi màn hình (Tab Switcher) đơn giản và trực quan
 * Giúp giảng viên và học viên dễ dàng kiểm tra cả 3 màn hình của Lab01
 */
export default function HeaderNav({ currentScreen, onSelectScreen }) {
  const tabs = [
    { key: 'login', label: 'Login', icon: 'account-lock' },
    { key: 'cart', label: 'Cart', icon: 'cart' },
    { key: 'tasks', label: 'Tasks', icon: 'format-list-checks' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = currentScreen === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onSelectScreen(tab.key)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={18}
                color={isActive ? '#FFFFFF' : '#6B7280'}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
