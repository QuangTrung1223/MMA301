import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

/**
 * Exercise 2 (PDF Slide 3): Navigator - Screen 2
 * Nhận tham số route.params.name và hiển thị lời chào, nút GO BACK
 */
export default function NavigatorScreen2({ route, navigation }) {
  const name = route.params?.name || 'Friend';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greetingText}>Hello, {name}!</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>GO BACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BCE0FD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
