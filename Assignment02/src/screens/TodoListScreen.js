import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getTasks,
  addTask,
  toggleTaskCompletion,
  deleteTask,
  updateTaskTitle,
} from '../services/db';

/**
 * Màn hình Todo List với SQLite (Assignment 2 & Assignment 1 nâng cấp)
 * Các tính năng cốt lõi:
 * 1. FlatList hiển thị danh sách task từ SQLite.
 * 2. TextInput + nút Add để thêm task mới vào database.
 * 3. Nút Complete chuyển đổi trạng thái hoàn thành (gạch ngang textDecorationLine).
 * 4. Nút Delete xóa task khỏi database (có Alert xác nhận).
 * 5. Bộ lọc trạng thái: Tất cả (All), Đang làm (Pending), Đã xong (Completed).
 * 6. Chỉnh sửa tiêu đề công việc (Edit Task).
 * 7. Đảm bảo dữ liệu 100% bền vững trong SQLite khi tắt/mở app.
 */
export default function TodoListScreen() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  // State cho Modal chỉnh sửa task
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Tải danh sách tasks từ SQLite
  const loadTasksFromDB = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTasks(currentFilter);
      setTasks(data || []);
    } catch (error) {
      console.error('Lỗi khi tải tasks:', error);
      Alert.alert('Lỗi', 'Không thể đọc dữ liệu từ SQLite Database.');
    } finally {
      setLoading(false);
    }
  }, [currentFilter]);

  useEffect(() => {
    loadTasksFromDB();
  }, [loadTasksFromDB]);

  // Thêm công việc mới
  const handleAddTask = async () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung công việc.');
      return;
    }

    try {
      await addTask(trimmed);
      setNewTaskTitle('');
      await loadTasksFromDB();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm công việc vào SQLite.');
    }
  };

  // Đổi trạng thái hoàn thành (0 <-> 1)
  const handleToggleComplete = async (task) => {
    try {
      await toggleTaskCompletion(task.id, task.completed);
      await loadTasksFromDB();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc.');
    }
  };

  // Xóa công việc khỏi SQLite (yêu cầu xác nhận)
  const handleDeleteTask = (task) => {
    const doDelete = async () => {
      try {
        await deleteTask(task.id);
        await loadTasksFromDB();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể xóa công việc khỏi SQLite.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa công việc:\n"${task.title}"?`);
      if (confirmed) {
        doDelete();
      }
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa công việc:\n"${task.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: doDelete,
        },
      ]
    );
  };


  // Mở modal sửa task
  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setIsEditModalVisible(true);
  };

  // Lưu chỉnh sửa task vào SQLite
  const handleSaveEdit = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      Alert.alert('Lỗi', 'Tiêu đề công việc không được để trống.');
      return;
    }

    try {
      await updateTaskTitle(editingTask.id, trimmed);
      setIsEditModalVisible(false);
      setEditingTask(null);
      await loadTasksFromDB();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật công việc vào SQLite.');
    }
  };

  // Render từng dòng task
  const renderTaskItem = ({ item }) => {
    const isCompleted = item.completed === 1;

    return (
      <View style={[styles.taskCard, isCompleted && styles.taskCardCompleted]}>
        {/* Nút Toggle Checkbox */}
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => handleToggleComplete(item)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isCompleted ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
            size={24}
            color={isCompleted ? '#10B981' : '#94A3B8'}
          />
        </TouchableOpacity>

        {/* Tiêu đề Task (Hiệu ứng gạch ngang strikethrough khi hoàn thành) */}
        <View style={styles.taskTextContainer}>
          <Text
            style={[
              styles.taskTitle,
              isCompleted && styles.taskTitleCompleted,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.taskMeta}>#{item.id}</Text>
            <Text
              style={[
                styles.statusBadge,
                isCompleted ? styles.statusBadgeDone : styles.statusBadgePending,
              ]}
            >
              {isCompleted ? 'Đã hoàn thành' : 'Đang chờ xử lý'}
            </Text>
          </View>
        </View>

        {/* Cụm nút hành động theo đúng yêu cầu Assignment 2: Complete, Edit, Delete */}
        <View style={styles.actionButtons}>
          {/* Nút Complete Button */}
          <TouchableOpacity
            style={[
              styles.badgeButton,
              isCompleted ? styles.badgeButtonUndone : styles.badgeButtonComplete,
            ]}
            onPress={() => handleToggleComplete(item)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={isCompleted ? 'undo' : 'check'}
              size={14}
              color={isCompleted ? '#64748B' : '#FFFFFF'}
            />
            <Text
              style={[
                styles.badgeButtonText,
                isCompleted ? styles.badgeButtonTextUndone : styles.badgeButtonTextComplete,
              ]}
            >
              {isCompleted ? 'Hủy xong' : 'Complete'}
            </Text>
          </TouchableOpacity>

          {/* Nút Edit */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleOpenEditModal(item)}
          >
            <MaterialCommunityIcons name="pencil-outline" size={18} color="#3B82F6" />
          </TouchableOpacity>

          {/* Nút Delete */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteTask(item)}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Khung nhập công việc mới */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tên công việc mới..."
            placeholderTextColor="#94A3B8"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTask}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>

        {/* Bộ lọc trạng thái */}
        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'pending', label: 'Chưa xong' },
            { key: 'completed', label: 'Đã xong' },
          ].map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterTab,
                currentFilter === f.key && styles.filterTabActive,
              ]}
              onPress={() => setCurrentFilter(f.key)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  currentFilter === f.key && styles.filterTabTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Danh sách Task bằng FlatList */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.emptyText}>Đang tải dữ liệu từ SQLite...</Text>
          </View>
        ) : tasks.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Chưa có công việc nào</Text>
            <Text style={styles.emptyText}>
              {currentFilter === 'all'
                ? 'Hãy nhập tên công việc ở trên và ấn ADD để lưu vào SQLite.'
                : 'Không có công việc nào phù hợp với bộ lọc hiện tại.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTaskItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Modal chỉnh sửa Task */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa công việc</Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
              placeholder="Nhập tên công việc"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonSaveText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#007AFF',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
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
  checkButton: {
    marginRight: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    lineHeight: 20,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskMeta: {
    fontSize: 11,
    color: '#94A3B8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  statusBadgeDone: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusBadgePending: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 2,
  },
  badgeButtonComplete: {
    backgroundColor: '#10B981',
  },
  badgeButtonUndone: {
    backgroundColor: '#E2E8F0',
  },
  badgeButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  badgeButtonTextComplete: {
    color: '#FFFFFF',
  },
  badgeButtonTextUndone: {
    color: '#64748B',
  },
  iconButton: {
    padding: 6,
    marginLeft: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#475569',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 18,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#F1F5F9',
  },
  modalButtonCancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  modalButtonSave: {
    backgroundColor: '#007AFF',
  },
  modalButtonSaveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
