import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DrawerLayoutAndroid,
  Platform,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Exercise 3 (PDF Slide 4): DrawerLayoutAndroid
 * Minh họa menu trượt ngăn kéo Drawer với React Native gốc
 * Có bổ sung fallback cho iOS/Web để đảm bảo ứng dụng chạy mượt mà trên mọi thiết bị
 */
export default function DrawerLayoutAndroidComp() {
  const drawerRef = useRef(null);

  // Fallback state cho iOS/Web khi không hỗ trợ native DrawerLayoutAndroid
  const [isDrawerOpenIosWeb, setIsDrawerOpenIosWeb] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current;

  const openDrawer = () => {
    if (Platform.OS === 'android' && drawerRef.current) {
      drawerRef.current.openDrawer();
    } else {
      setIsDrawerOpenIosWeb(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeDrawer = () => {
    if (Platform.OS === 'android' && drawerRef.current) {
      drawerRef.current.closeDrawer();
    } else {
      Animated.timing(slideAnim, {
        toValue: -280,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpenIosWeb(false));
    }
  };

  // Giao diện bên trong ngăn kéo (Navigation View)
  const navigationView = () => (
    <SafeAreaView style={styles.navigationContainer}>
      <Text style={styles.drawerItem}>Item 1</Text>
      <Text style={styles.drawerItem}>Item 2</Text>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={closeDrawer}
        activeOpacity={0.8}
      >
        <Text style={styles.closeButtonText}>Close Drawer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Giao diện màn hình chính
  const mainContent = (
    <View style={styles.mainContainer}>
      {/* Thanh Header có icon hamburger 3 gạch */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={openDrawer}
          style={styles.hamburgerButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={26} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Header</Text>
      </View>

      {/* Nội dung chính giữa màn hình */}
      <View style={styles.body}>
        <Text style={styles.bodyText}>DrawerLayoutAndroid</Text>
      </View>
    </View>
  );

  if (Platform.OS === 'android') {
    return (
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerWidth={280}
        drawerPosition="left"
        renderNavigationView={navigationView}
      >
        {mainContent}
      </DrawerLayoutAndroid>
    );
  }

  // Fallback mượt mà cho iOS / Web
  return (
    <View style={{ flex: 1 }}>
      {mainContent}
      {isDrawerOpenIosWeb && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              styles.iosDrawerWrapper,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {navigationView()}
          </Animated.View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
  },
  hamburgerButton: {
    padding: 6,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#212529',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
  },
  navigationContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  drawerItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 20,
    paddingVertical: 4,
  },
  closeButton: {
    backgroundColor: '#CCCCCC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 999,
  },
  iosDrawerWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
