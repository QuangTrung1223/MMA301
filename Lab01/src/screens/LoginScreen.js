import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Màn hình Đăng nhập (LoginScreen) theo chuẩn mẫu thiết kế Lab_Layout
 * Bao gồm: Form đăng nhập, Validate Email/Mật khẩu thời gian thực,
 * Ẩn/Hiện mật khẩu, Remember password, Nút Login & Cancel.
 */
export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  // Trạng thái lưu trữ thông báo lỗi
  const [errors, setErrors] = useState({ email: '', password: '' });
  // Đánh dấu người dùng đã tương tác với ô input để bắt đầu validate
  const [touched, setTouched] = useState({ email: false, password: false });

  // Hàm kiểm tra định dạng email hợp lệ bằng Regex
  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Validate ô Email
  const validateEmail = (value) => {
    if (!value.trim()) {
      return 'Email is required.';
    }
    if (!isValidEmail(value)) {
      return 'Invalid email format.';
    }
    return '';
  };

  // Validate ô Password
  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required.';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return '';
  };

  // Xử lý khi thay đổi nội dung Email
  const handleEmailChange = (text) => {
    setEmail(text);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
    }
  };

  // Xử lý khi thay đổi nội dung Mật khẩu
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(text) }));
    }
  };

  // Xử lý khi bấm nút Login
  const handleLogin = () => {
    setTouched({ email: true, password: true });
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setErrors({ email: emailErr, password: passErr });

    // Nếu không có lỗi nào thì đăng nhập thành công
    if (!emailErr && !passErr) {
      Alert.alert(
        'Đăng nhập thành công',
        `Chào mừng ${email} quay trở lại! Bạn có muốn chuyển sang Giỏ hàng không?`,
        [
          { text: 'Ở lại', style: 'cancel' },
          {
            text: 'Đến Giỏ hàng',
            onPress: () => {
              if (onLoginSuccess) {
                onLoginSuccess();
              }
            },
          },
        ]
      );
    }
  };

  // Xử lý khi bấm nút Cancel (Xóa trắng dữ liệu đã nhập)
  const handleCancel = () => {
    setEmail('');
    setPassword('');
    setRememberPassword(false);
    setErrors({ email: '', password: '' });
    setTouched({ email: false, password: false });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Phần Header: Tiêu đề và hình minh họa */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome Back</Text>

          {/* Minh họa người dùng có ổ khóa bảo mật */}
          <View style={styles.illustrationContainer}>
            <View style={styles.avatarRow}>
              <View style={[styles.avatarCircle, { backgroundColor: '#8D5B4C' }]}>
                <MaterialCommunityIcons name="account" size={44} color="#FCE7D0" />
              </View>
              <View style={[styles.avatarCircle, { backgroundColor: '#C87D55', marginLeft: -12 }]}>
                <MaterialCommunityIcons name="account" size={42} color="#FCE7D0" />
              </View>
            </View>
            {/* Biểu tượng ổ khóa màu vàng */}
            <View style={styles.lockBadge}>
              <MaterialCommunityIcons name="lock" size={26} color="#1E293B" />
            </View>
          </View>
        </View>

        {/* Ô nhập Email */}
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputBox,
              touched.email && errors.email ? styles.inputBoxError : null,
            ]}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={22}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }));
                setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
              }}
            />
          </View>
          {/* Thông báo lỗi Email */}
          {touched.email && errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Ô nhập Password */}
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputBox,
              touched.password && errors.password ? styles.inputBoxError : null,
            ]}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={22}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }));
                setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
              }}
            />
            {/* Nút bật tắt ẩn/hiện mật khẩu */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {/* Thông báo lỗi Password */}
          {touched.password && errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Checkbox Ghi nhớ mật khẩu (Remember password) */}
        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberPassword(!rememberPassword)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberPassword && styles.checkboxChecked]}>
            {rememberPassword && (
              <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.rememberText}>Remember password</Text>
        </TouchableOpacity>

        {/* Cặp nút hành động: Login (Xanh) và Cancel (Đỏ) */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.btn, styles.btnLogin]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.btnCancel]}
            onPress={handleCancel}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Chân trang: Đăng ký tài khoản mới */}
        <View style={styles.footerRow}>
          <Text style={styles.footerNormalText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Sign Up', 'Chức năng Đăng ký tài khoản sẽ phát triển ở các bài học tiếp theo!')
            }
          >
            <Text style={styles.footerLinkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  illustrationContainer: {
    width: 110,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputBoxError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    height: '100%',
  },
  errorText: {
    fontSize: 12.5,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.8,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  rememberText: {
    fontSize: 14.5,
    color: '#4B5563',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 28,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  btnLogin: {
    backgroundColor: '#007BFF',
  },
  btnCancel: {
    backgroundColor: '#DC2626',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerNormalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLinkText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
});
