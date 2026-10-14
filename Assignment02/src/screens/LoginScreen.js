import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getSavedCredentials, saveCredentials } from '../services/authStorage';
import { initDatabase } from '../services/db';

/**
 * Màn hình Đăng nhập (LoginScreen) - Assignment 2
 * Các tính năng theo yêu cầu đề bài:
 * 1. Nhập Username và Password.
 * 2. Nút Login xử lý đăng nhập, validate không được để trống.
 * 3. Checkbox "Remember Password":
 *    - Nếu chọn: lưu thông tin để Auto-Login các lần mở app sau.
 *    - Nếu không chọn: không lưu thông tin, bắt buộc đăng nhập lại.
 * 4. Tự động kiểm tra Auto-Login khi khởi động app.
 */
export default function LoginScreen({ navigation, route }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAutoLogin, setIsCheckingAutoLogin] = useState(true);

  // Khởi tạo Database SQLite và kiểm tra Auto-Login khi mở ứng dụng
  useEffect(() => {
    async function setupApp() {
      try {
        await initDatabase();

        // Nếu vừa đăng xuất thì bỏ qua Auto-Login và hiển thị form đăng nhập trống
        if (route?.params?.isLoggedOut) {
          setUsername('');
          setPassword('');
          setIsCheckingAutoLogin(false);
          return;
        }

        const saved = await getSavedCredentials();
        if (saved && saved.remember && saved.username && saved.password) {
          // Tự động chuyển thẳng vào màn hình chính (Auto-Login)
          navigation.replace('MainApp', { username: saved.username });
          return;
        }
      } catch (error) {
        console.warn('Lỗi kiểm tra Auto-Login:', error);
      } finally {
        setIsCheckingAutoLogin(false);
      }
    }

    setupApp();
  }, [navigation, route?.params?.isLoggedOut]);


  const handleLogin = async () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Validate: Bắt buộc nhập đầy đủ Username và Password
    if (!trimmedUser || !trimmedPass) {
      Alert.alert('Lỗi đăng nhập', 'Vui lòng nhập đầy đủ Tên đăng nhập và Mật khẩu.');
      return;
    }

    try {
      // Lưu hoặc xóa thông tin đăng nhập theo trạng thái checkbox
      await saveCredentials(trimmedUser, trimmedPass, rememberPassword);

      // Chuyển hướng sang màn hình chính của ứng dụng
      navigation.replace('MainApp', { username: trimmedUser });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể hoàn tất đăng nhập. Vui lòng thử lại.');
    }
  };

  if (isCheckingAutoLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang kiểm tra thông tin đăng nhập...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header Icon & Title */}
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="shield-lock-outline" size={54} color="#007AFF" />
          </View>
          <Text style={styles.title}>Assignment 2</Text>
          <Text style={styles.subtitle}>Đăng nhập để quản lý công việc và danh bạ</Text>

          {/* Ô nhập Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên đăng nhập (Username):</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="account-outline"
                size={22}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập username (ví dụ: namnv)"
                placeholderTextColor="#94A3B8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Ô nhập Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu (Password):</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={22}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkbox Remember Password */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRememberPassword(!rememberPassword)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={rememberPassword ? 'checkbox-marked' : 'checkbox-blank-outline'}
              size={24}
              color={rememberPassword ? '#007AFF' : '#94A3B8'}
            />
            <Text style={styles.checkboxLabel}>Remember Password (Tự động đăng nhập lần sau)</Text>
          </TouchableOpacity>

          {/* Nút Login */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>LOGIN</Text>
          </TouchableOpacity>

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              💡 Dữ liệu Todo List & Danh bạ được lưu trữ bền vững trong cơ sở dữ liệu SQLite cục bộ (offline).
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#0F172A',
  },
  eyeButton: {
    padding: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  noteBox: {
    marginTop: 20,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#22C55E',
  },
  noteText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 18,
  },
});
