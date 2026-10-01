import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Thanh điều hướng Tab Header chuyên nghiệp cho Lab02
 * Giúp giảng viên và học viên nhanh chóng chuyển đổi và kiểm tra từng bài tập
 */
export default function HeaderNav({ currentScreen, onSelectScreen }) {
  const tabs = [
    { key: 'sectionList', label: 'SectionList', icon: 'format-list-bulleted-type' },
    { key: 'navigator', label: 'Navigator', icon: 'navigation-variant-outline' },
    { key: 'drawer', label: 'Drawer', icon: 'view-headline' },
    { key: 'safeArea', label: 'SafeArea', icon: 'crop-free' },
    { key: 'authCart', label: 'Login & Cart', icon: 'cart-outline' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
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
                  size={16}
                  color={isActive ? '#FFFFFF' : '#6B7280'}
                  style={styles.tabIcon}
                />
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 6,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginHorizontal: 2,
  },
  activeTabButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
});
