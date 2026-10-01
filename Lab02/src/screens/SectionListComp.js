import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';

const sections = [
  {
    id: '0',
    title: 'Basic Components',
    data: [
      { id: '0', text: 'View' },
      { id: '1', text: 'Text' },
      { id: '2', text: 'Image' },
    ],
  },
  {
    id: '1',
    title: 'List Components',
    data: [
      { id: '3', text: 'ScrollView' },
      { id: '4', text: 'ListView' },
    ],
  },
];

/**
 * Exercise 1 (PDF Slide 1-2): SectionList Component
 * Minh họa danh sách phân nhóm với SectionList, renderSectionHeader và renderItem
 */
export default function SectionListComp() {
  return (
    <View style={styles.wrapper}>
      <SectionList
        style={styles.container}
        sections={sections}
        renderItem={({ item }) => <Text style={styles.row}>{item.text}</Text>}
        renderSectionHeader={({ section }) => (
          <Text style={styles.header}>{section.title}</Text>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'skyblue',
    borderRadius: 4,
    fontSize: 15,
    color: '#002B49',
    fontWeight: '500',
  },
  header: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'steelblue',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: 4,
    fontSize: 16,
  },
});
