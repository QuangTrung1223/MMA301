import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mma301_remembered_credentials';

/**
 * Lưu thông tin đăng nhập phục vụ Auto-Login (Assignment 2)
 * Đồng bộ cả AsyncStorage và window.localStorage trên Web
 */
export async function saveCredentials(username, password, remember = true) {
  try {
    if (remember) {
      const payload = JSON.stringify({
        username: username.trim(),
        password,
        remember: true,
        savedAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem(STORAGE_KEY, payload);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, payload);
      }
    } else {
      await clearCredentials();
    }
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu thông tin đăng nhập:', error);
    return false;
  }
}

/**
 * Lấy thông tin đăng nhập đã lưu trong AsyncStorage / localStorage
 */
export async function getSavedCredentials() {
  try {
    let raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw && typeof window !== 'undefined' && window.localStorage) {
      raw = window.localStorage.getItem(STORAGE_KEY);
    }
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Lỗi khi đọc thông tin đăng nhập:', error);
    return null;
  }
}

/**
 * Xóa hoàn toàn thông tin đăng nhập (khi người dùng đăng xuất)
 */
export async function clearCredentials() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  } catch (error) {
    console.error('Lỗi khi xóa thông tin đăng nhập:', error);
    return false;
  }
}
