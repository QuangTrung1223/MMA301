import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { INITIAL_CART_ITEMS } from '../data/mockData';

/**
 * Màn hình Giỏ hàng (ShoppingCartScreen) theo giao diện Lab_Layout
 * Bao gồm:
 * - Danh sách sản phẩm với ảnh, tiêu đề, mô tả, đơn giá đỏ.
 * - Bộ đếm số lượng (+ / -) cho từng món.
 * - Checkbox lựa chọn sản phẩm.
 * - Nút Delete ở góc phải trên để xóa các sản phẩm đang được chọn.
 * - Thanh Total tự động tính tổng tiền giỏ hàng.
 * - Nút Checkout thanh toán.
 */
export default function ShoppingCartScreen() {
  const [items, setItems] = useState(INITIAL_CART_ITEMS);

  // Tăng số lượng sản phẩm
  const handleIncrease = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Giảm số lượng sản phẩm (tối thiểu là 1)
  const handleDecrease = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // Bật/tắt trạng thái chọn (Selection) bằng Checkbox
  const handleToggleSelect = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Xóa các sản phẩm đang được tích chọn (Selection)
  const handleDeleteSelected = () => {
    const selectedCount = items.filter((item) => item.selected).length;

    if (selectedCount === 0) {
      Alert.alert(
        'Chưa chọn sản phẩm',
        'Vui lòng tích chọn ít nhất 1 sản phẩm bằng ô checkbox để xóa.'
      );
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa ${selectedCount} sản phẩm đã chọn khỏi giỏ hàng?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa ngay',
          style: 'destructive',
          onPress: () => {
            setItems((prevItems) => prevItems.filter((item) => !item.selected));
          },
        },
      ]
    );
  };

  // Tính tổng tiền (Total) tự động của tất cả sản phẩm trong giỏ hàng
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Xử lý khi nhấn Checkout
  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Bạn chưa có sản phẩm nào để thanh toán!');
      return;
    }
    Alert.alert(
      'Thanh toán đơn hàng',
      `Tổng số tiền cần thanh toán: ${totalAmount} $\nCảm ơn bạn đã mua sắm tại FPT University Store!`,
      [
        {
          text: 'Xác nhận',
          onPress: () => {
            // Reset giỏ hàng sau khi thanh toán
            setItems([]);
          },
        },
      ]
    );
  };

  // Nút khôi phục lại dữ liệu mẫu khi đã xóa hết
  const handleResetData = () => {
    setItems(INITIAL_CART_ITEMS);
  };

  // Render từng dòng sản phẩm
  const renderItem = ({ item }) => {
    return (
      <View style={styles.cartCard}>
        {/* Hình ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Thông tin sản phẩm: Tên, mô tả, giá và bộ đếm */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.itemTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {/* Checkbox lựa chọn sản phẩm */}
            <TouchableOpacity
              style={[styles.checkbox, item.selected && styles.checkboxSelected]}
              onPress={() => handleToggleSelect(item.id)}
              activeOpacity={0.7}
            >
              {item.selected && (
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Hàng giá tiền và nút tăng giảm số lượng */}
          <View style={styles.priceAndQtyRow}>
            <Text style={styles.itemPrice}>{item.price} $</Text>

            <View style={styles.qtyControls}>
              <TouchableOpacity
                onPress={() => handleDecrease(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="minus-circle-outline"
                  size={24}
                  color="#9CA3AF"
                />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => handleIncrease(item.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name="plus-circle-outline"
                  size={24}
                  color="#007BFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header: Shopping Cart & Nút Delete */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteSelected}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách các sản phẩm */}
      {items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="cart-off" size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleResetData}
            activeOpacity={0.8}
          >
            <Text style={styles.resetBtnText}>Tải lại sản phẩm mẫu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer: Thanh tổng tiền và nút Checkout */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{totalAmount} $</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, items.length === 0 && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          activeOpacity={0.85}
          disabled={items.length === 0}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  deleteBtn: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 8,
  },
  deleteBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.8,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxSelected: {
    backgroundColor: '#007BFF',
  },
  itemDescription: {
    fontSize: 12.5,
    color: '#6B7280',
    lineHeight: 17,
    marginVertical: 4,
  },
  priceAndQtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#EF4444',
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    minWidth: 18,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: '#EF4444',
  },
  checkoutBtn: {
    backgroundColor: '#007BFF',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16.5,
    fontWeight: '700',
  },
});
