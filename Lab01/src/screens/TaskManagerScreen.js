import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { INITIAL_TASKS } from '../data/mockData';

/**
 * Màn hình Quản lý Công việc (TaskManagerScreen / Todo List)
 * Đáp ứng toàn bộ yêu cầu trong file Assignment1_ListTask.docx:
 * 1. Hiển thị danh sách công việc hiện tại.
 * 2. Ô nhập thêm công việc mới.
 * 3. Mỗi công việc có: Tiêu đề, nút Complete (đổi trạng thái & gạch ngang chữ), nút Delete.
 * 4. Thử thách nâng cao: Bộ lọc All / Completed / Incomplete, chỉnh sửa (Edit) trực tiếp công việc.
 */
export default function TaskManagerScreen() {
  // State lưu trữ danh sách các công việc
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  // State lưu nội dung công việc mới đang gõ trong ô Input
  const [taskText, setTaskText] = useState('');
  // State bộ lọc hiện tại: 'all' | 'completed' | 'incomplete'
  const [filter, setFilter] = useState('all');

  // State hỗ trợ chức năng Sửa công việc (Edit)
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // 1. Thêm công việc mới
  const handleAddTask = () => {
    if (!taskText.trim()) {
      Alert.alert('Chưa nhập nội dung', 'Vui lòng nhập tên công việc cần làm!');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: taskText.trim(),
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setTaskText('');
    Keyboard.dismiss();
  };

  // 2. Chuyển đổi trạng thái Hoàn thành / Chưa hoàn thành (Toggle Complete)
  const handleToggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // 3. Xóa một công việc khỏi danh sách (Delete Task)
  const handleDeleteTask = (id, title) => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc muốn xóa công việc "${title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setTasks((prev) => prev.filter((t) => t.id !== id));
        },
      },
    ]);
  };

  // 4. Bắt đầu chỉnh sửa công việc
  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.title);
  };

  // 5. Lưu chỉnh sửa công việc
  const handleSaveEdit = (id) => {
    if (!editingText.trim()) {
      Alert.alert('Lỗi', 'Tiêu đề công việc không được để trống.');
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: editingText.trim() } : t))
    );
    setEditingTaskId(null);
    setEditingText('');
  };

  // Lọc danh sách công việc theo bộ lọc đã chọn
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'incomplete') return !t.completed;
    return true; // 'all'
  });

  // Đếm thống kê
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const incompleteCount = totalCount - completedCount;

  // Render từng công việc trong danh sách
  const renderTaskItem = ({ item }) => {
    const isEditing = editingTaskId === item.id;

    if (isEditing) {
      return (
        <View style={[styles.taskCard, styles.editingCard]}>
          <TextInput
            style={styles.editInput}
            value={editingText}
            onChangeText={setEditingText}
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => handleSaveEdit(item.id)}
            >
              <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelEditBtn}
              onPress={() => setEditingTaskId(null)}
            >
              <MaterialCommunityIcons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
        {/* Nút bấm Complete / Incomplete */}
        <TouchableOpacity
          style={[styles.checkCircle, item.completed && styles.checkCircleCompleted]}
          onPress={() => handleToggleComplete(item.id)}
          activeOpacity={0.7}
        >
          {item.completed && (
            <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
          )}
        </TouchableOpacity>

        {/* Tiêu đề công việc (Gạch ngang khi đã hoàn thành) */}
        <TouchableOpacity
          style={styles.taskTitleWrapper}
          onPress={() => handleToggleComplete(item.id)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.taskTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>

        {/* Cụm nút hành động: Edit và Delete */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionBtnEdit}
            onPress={() => handleStartEdit(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnDelete}
            onPress={() => handleDeleteTask(item.id, item.title)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề và thống kê */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Manager</Text>
        <Text style={styles.badgeText}>
          {completedCount}/{totalCount} đã xong
        </Text>
      </View>

      {/* Ô nhập thêm Task mới */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên công việc mới..."
          placeholderTextColor="#9CA3AF"
          value={taskText}
          onChangeText={setTaskText}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleAddTask}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bộ lọc công việc (All / Completed / Incomplete) */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[styles.filterText, filter === 'all' && styles.filterTextActive]}
          >
            Tất cả ({totalCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === 'incomplete' && styles.filterBtnActive,
          ]}
          onPress={() => setFilter('incomplete')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'incomplete' && styles.filterTextActive,
            ]}
          >
            Chưa xong ({incompleteCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === 'completed' && styles.filterBtnActive,
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterText,
              filter === 'completed' && styles.filterTextActive,
            ]}
          >
            Đã xong ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách Tasks */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={56}
            color="#CBD5E1"
          />
          <Text style={styles.emptyText}>
            {filter === 'completed'
              ? 'Chưa có công việc nào hoàn thành'
              : filter === 'incomplete'
              ? 'Tất cả công việc đã được hoàn thành!'
              : 'Danh sách công việc đang trống'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E293B',
    height: 46,
  },
  addBtn: {
    backgroundColor: '#007BFF',
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  filterBtnActive: {
    backgroundColor: '#0F172A',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.85,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskTitleWrapper: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionBtnEdit: {
    padding: 4,
  },
  actionBtnDelete: {
    padding: 4,
  },
  editingCard: {
    borderColor: '#3B82F6',
    borderWidth: 1.5,
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    paddingVertical: 2,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  saveBtn: {
    backgroundColor: '#10B981',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelEditBtn: {
    backgroundColor: '#E2E8F0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 12,
  },
});
