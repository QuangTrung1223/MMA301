import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

/**
 * Exercise 4 (PDF Slide 5): SafeAreaView
 * Minh họa cách SafeAreaView tự động căn chỉnh lề (insets) để nội dung không bị che
 * khuất bởi camera tai thỏ (notch), dynamic island hoặc thanh trạng thái (status bar).
 */
export default function SafeAreaViewComp() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Page content</Text>

        <View style={styles.explainerCard}>
          <Text style={styles.explainerTitle}>💡 Khái niệm SafeAreaView:</Text>
          <Text style={styles.explainerText}>
            - Trên iOS và các dòng máy có tai thỏ / notch hoặc camera nốt ruồi,
            nếu chỉ dùng View thông thường, chữ có thể bị tràn lên sát mép trên màn hình.
          </Text>
          <Text style={styles.explainerText}>
            - `SafeAreaView` tự động tính toán padding theo phần cứng để đảm bảo
            nội dung luôn hiển thị an toàn trong tầm mắt người dùng.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  explainerCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginTop: 10,
  },
  explainerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0052B3',
    marginBottom: 8,
  },
  explainerText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 6,
  },
});
