import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TodoListScreen from './TodoListScreen';
import ContactsScreen from './ContactsScreen';
import { clearCredentials } from '../services/authStorage';

/**
 * Màn hình trung tâm của ứng dụng Assignment02
 * Cho phép chuyển đổi linh hoạt giữa:
 * 1. Quản lý công việc Todo List (Assignment 2)
 * 2. Quản lý danh bạ Phone Contacts (LAB_sqlite)
 * Kèm nút Đăng xuất (Logout) xóa sạch thông tin Auto-Login
 */
export default function MainAppScreen({ route, navigation }) {
  const [activeTab, setActiveTab] = useState('todo'); // 'todo' | 'contacts'
  const username = route.params?.username || 'User';

  const performLogout = async () => {
    try {
      await clearCredentials();
      navigation.replace('Login', { isLoggedOut: true });
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      navigation.replace('Login', { isLoggedOut: true });
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Bạn có chắc chắn muốn đăng xuất? Thông tin Auto-Login sẽ được xóa.'
      );
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất? Thông tin Auto-Login sẽ được xóa.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>SQLite Storage</Text>
          <View style={styles.userBadge}>
            <MaterialCommunityIcons name="account-circle" size={14} color="#007AFF" />
            <Text style={styles.userBadgeText}>Xin chào, {username}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Switcher giữa Todo List và Phone Contacts */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'todo' && styles.tabButtonActive]}
          onPress={() => setActiveTab('todo')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="format-list-checks"
            size={18}
            color={activeTab === 'todo' ? '#FFFFFF' : '#64748B'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'todo' && styles.tabTextActive,
            ]}
          >
            Todo List (SQLite)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'contacts' && styles.tabButtonActive]}
          onPress={() => setActiveTab('contacts')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="contacts-outline"
            size={18}
            color={activeTab === 'contacts' ? '#FFFFFF' : '#64748B'}
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'contacts' && styles.tabTextActive,
            ]}
          >
            Contacts (LAB_sqlite)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {activeTab === 'todo' ? <TodoListScreen /> : <ContactsScreen />}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
  },
});
