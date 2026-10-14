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
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from '../services/db';

/**
 * Màn hình Quản lý Danh bạ Điện thoại bằng SQLite (LAB_sqlite.docx)
 * Đáp ứng đầy đủ 8 yêu cầu chức năng (FR01 -> FR08):
 * - FR01: View Contacts (Xem danh sách liên hệ)
 * - FR02: Add Contact (Thêm mới liên hệ vào SQLite)
 * - FR03: View Contact Details (Xem thông tin chi tiết)
 * - FR04: Update Contact (Cập nhật thông tin liên hệ)
 * - FR05: Delete Contact (Xóa liên hệ có xác nhận)
 * - FR06: Search Contacts (Tìm kiếm theo Tên hoặc Số điện thoại)
 * - FR07: Data Validation (Validate bắt buộc Tên, SĐT hợp lệ)
 * - FR08: Persistent Storage (Lưu trữ bền vững trong SQLite)
 */
export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // State cho Form Modal (Thêm mới / Chỉnh sửa)
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState(null); // null = Thêm mới, object = Sửa
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });

  // State cho Modal Xem chi tiết (FR03)
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  // Tải danh sách liên hệ từ SQLite
  const loadContactsFromDB = useCallback(async (query = searchQuery) => {
    try {
      setLoading(true);
      const data = await getContacts(query);
      setContacts(data || []);
    } catch (error) {
      console.error('Lỗi khi tải contacts:', error);
      Alert.alert('Lỗi', 'Không thể đọc dữ liệu danh bạ từ SQLite Database.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadContactsFromDB(searchQuery);
  }, [searchQuery, loadContactsFromDB]);

  // Xử lý mở Modal Thêm mới (FR02)
  const handleOpenAddModal = () => {
    setEditingContact(null);
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setIsFormModalVisible(true);
  };

  // Xử lý mở Modal Chỉnh sửa (FR04)
  const handleOpenEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      email: contact.email || '',
      notes: contact.notes || '',
    });
    setIsDetailModalVisible(false);
    setIsFormModalVisible(true);
  };

  // FR07: Validate dữ liệu đầu vào
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập họ và tên liên hệ.');
      return false;
    }
    const cleanPhone = formData.phone.trim();
    if (!cleanPhone) {
      Alert.alert('Lỗi nhập liệu', 'Vui lòng nhập số điện thoại.');
      return false;
    }
    const phoneRegex = /^[0-9+ ]{8,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert(
        'Lỗi nhập liệu',
        'Số điện thoại không hợp lệ (phải từ 8-15 ký tự số).'
      );
      return false;
    }
    return true;
  };

  // Lưu thông tin liên hệ (Thêm mới hoặc Cập nhật)
  const handleSaveContact = async () => {
    if (!validateForm()) return;

    try {
      if (editingContact) {
        // Cập nhật (FR04)
        await updateContact(
          editingContact.id,
          formData.name,
          formData.phone,
          formData.email,
          formData.notes
        );
      } else {
        // Thêm mới (FR02)
        await addContact(
          formData.name,
          formData.phone,
          formData.email,
          formData.notes
        );
      }
      setIsFormModalVisible(false);
      await loadContactsFromDB();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu liên hệ vào SQLite Database.');
    }
  };

  // FR05: Xóa liên hệ có xác nhận
  const handleDeleteContact = (contact) => {
    const doDelete = async () => {
      try {
        await deleteContact(contact.id);
        if (selectedContact?.id === contact.id) {
          setIsDetailModalVisible(false);
        }
        await loadContactsFromDB();
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể xóa liên hệ khỏi SQLite.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        `Bạn có chắc chắn muốn xóa liên hệ "${contact.name}" (${contact.phone})?`
      );
      if (confirmed) {
        doDelete();
      }
      return;
    }

    Alert.alert(
      'Xác nhận xóa liên hệ',
      `Bạn có chắc chắn muốn xóa liên hệ "${contact.name}" (${contact.phone})?`,
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


  // FR03: Xem chi tiết liên hệ
  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalVisible(true);
  };

  // Render từng dòng liên hệ
  const renderContactItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactCard}
      onPress={() => handleViewDetails(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name ? item.name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>

      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        {item.email ? <Text style={styles.contactEmail}>{item.email}</Text> : null}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => handleOpenEditModal(item)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionIcon}
          onPress={() => handleDeleteContact(item)}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* FR06: Thanh tìm kiếm liên hệ */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={22} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên hoặc số điện thoại..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.newContactButton}
          onPress={handleOpenAddModal}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="account-plus-outline" size={20} color="#FFFFFF" />
          <Text style={styles.newContactButtonText}>THÊM</Text>
        </TouchableOpacity>
      </View>

      {/* FR01: Danh sách liên hệ lưu trong SQLite */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.emptyText}>Đang đọc danh bạ từ SQLite...</Text>
          </View>
        ) : contacts.length === 0 ? (
          <View style={styles.centerContainer}>
            <MaterialCommunityIcons name="account-search-outline" size={56} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Không tìm thấy liên hệ</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Không có kết quả phù hợp với từ khóa tìm kiếm.'
                : 'Danh bạ trống. Hãy bấm "THÊM" để tạo liên hệ đầu tiên!'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderContactItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FR02 & FR04: Modal Thêm / Chỉnh sửa liên hệ */}
      <Modal
        visible={isFormModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFormModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingContact ? 'Cập nhật liên hệ' : 'Thêm liên hệ mới'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Họ và tên (*):</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ví dụ: Nguyễn Văn Nam"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.formLabel}>Số điện thoại (*):</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ví dụ: 0987654321"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />

              <Text style={styles.formLabel}>Email:</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Ví dụ: namnv@fpt.edu.vn"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />

              <Text style={styles.formLabel}>Ghi chú:</Text>
              <TextInput
                style={[styles.formInput, styles.formInputArea]}
                placeholder="Thông tin bổ sung..."
                multiline
                numberOfLines={3}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsFormModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveContact}
              >
                <Text style={styles.modalButtonSaveText}>Lưu vào SQLite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* FR03: Modal Xem chi tiết liên hệ */}
      <Modal
        visible={isDetailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDetailModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.detailCard}>
            <View style={styles.detailAvatar}>
              <Text style={styles.detailAvatarText}>
                {selectedContact?.name ? selectedContact.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>

            <Text style={styles.detailName}>{selectedContact?.name}</Text>
            <Text style={styles.detailPhone}>{selectedContact?.phone}</Text>

            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#64748B" />
              <Text style={styles.detailRowText}>
                {selectedContact?.email || 'Chưa cập nhật email'}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="note-text-outline" size={20} color="#64748B" />
              <Text style={styles.detailRowText}>
                {selectedContact?.notes || 'Không có ghi chú'}
              </Text>
            </View>

            <View style={styles.detailButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsDetailModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={() => selectedContact && handleOpenEditModal(selectedContact)}
              >
                <Text style={styles.modalButtonSaveText}>Chỉnh sửa</Text>
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
    marginLeft: 6,
  },
  newContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  newContactButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  contactCard: {
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
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  contactPhone: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  contactEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 6,
    marginLeft: 4,
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
    maxWidth: 380,
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  formInputArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
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
  detailCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  detailAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0284C7',
  },
  detailName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  detailPhone: {
    fontSize: 15,
    color: '#007AFF',
    marginTop: 4,
  },
  detailDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  detailRowText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 10,
    flex: 1,
  },
  detailButtons: {
    flexDirection: 'row',
    marginTop: 16,
    width: '100%',
    justifyContent: 'flex-end',
  },
});
