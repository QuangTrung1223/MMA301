/**
 * Web Implementation of Database Service for Assignment02
 * Lưu trữ bền vững trên Web Browser bằng window.localStorage
 * Tuyệt đối không import 'expo-sqlite' để tránh lỗi: Cannot find native module 'ExpoSQLite' trên Web
 */

const STORAGE_KEYS = {
  TASKS: '@mma301_sqlite_web_tasks',
  CONTACTS: '@mma301_sqlite_web_contacts',
};

// Dữ liệu mẫu ban đầu
const INITIAL_TASKS = [
  { id: 1, title: 'Học cú pháp JSX và Component trong React Native', completed: 1, created_at: new Date().toISOString() },
  { id: 2, title: 'Thực hành quản lý State với SQLite database', completed: 0, created_at: new Date().toISOString() },
  { id: 3, title: 'Hoàn thiện chức năng Auto-Login và Remember Password', completed: 0, created_at: new Date().toISOString() },
];

const INITIAL_CONTACTS = [
  { id: 1, name: 'Nguyễn Văn Nam', phone: '0987654321', email: 'namnv@fpt.edu.vn', notes: 'Giảng viên MMA301', created_at: new Date().toISOString() },
  { id: 2, name: 'Trần Thị Mai', phone: '0912345678', email: 'maitt@gmail.com', notes: 'Trưởng nhóm đồ án', created_at: new Date().toISOString() },
  { id: 3, name: 'Lê Hoàng Long', phone: '0905123987', email: 'longlh@company.vn', notes: 'Đồng nghiệp', created_at: new Date().toISOString() },
];

function getFromStorage(key, defaultValue) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = window.localStorage.getItem(key);
      if (data) return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Lỗi đọc localStorage:', e);
  }
  return defaultValue;
}

function saveToStorage(key, value) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn('Lỗi ghi localStorage:', e);
  }
}

let memoryTasks = null;
let memoryContacts = null;

export async function initDatabase() {
  if (!memoryTasks) {
    memoryTasks = getFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    saveToStorage(STORAGE_KEYS.TASKS, memoryTasks);
  }
  if (!memoryContacts) {
    memoryContacts = getFromStorage(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS);
    saveToStorage(STORAGE_KEYS.CONTACTS, memoryContacts);
  }
  return true;
}

export async function getTasks(filter = 'all') {
  await initDatabase();
  let list = memoryTasks || [];
  if (filter === 'completed') {
    return list.filter((t) => t.completed === 1);
  }
  if (filter === 'pending') {
    return list.filter((t) => t.completed === 0);
  }
  return [...list];
}

export async function addTask(title) {
  await initDatabase();
  const trimmed = title.trim();
  if (!trimmed) return null;

  const newTask = {
    id: Date.now(),
    title: trimmed,
    completed: 0,
    created_at: new Date().toISOString(),
  };

  memoryTasks = [newTask, ...(memoryTasks || [])];
  saveToStorage(STORAGE_KEYS.TASKS, memoryTasks);
  return newTask.id;
}

export async function toggleTaskCompletion(id, currentCompleted) {
  await initDatabase();
  const newStatus = currentCompleted === 1 ? 0 : 1;
  memoryTasks = (memoryTasks || []).map((t) =>
    t.id === id ? { ...t, completed: newStatus } : t
  );
  saveToStorage(STORAGE_KEYS.TASKS, memoryTasks);
  return true;
}

export async function updateTaskTitle(id, newTitle) {
  await initDatabase();
  const trimmed = newTitle.trim();
  if (!trimmed) return false;

  memoryTasks = (memoryTasks || []).map((t) =>
    t.id === id ? { ...t, title: trimmed } : t
  );
  saveToStorage(STORAGE_KEYS.TASKS, memoryTasks);
  return true;
}

export async function deleteTask(id) {
  await initDatabase();
  memoryTasks = (memoryTasks || []).filter((t) => t.id !== id);
  saveToStorage(STORAGE_KEYS.TASKS, memoryTasks);
  return true;
}

export async function getContacts(searchQuery = '') {
  await initDatabase();
  const keyword = searchQuery.trim().toLowerCase();
  const list = memoryContacts || [];

  if (!keyword) {
    return [...list];
  }
  return list.filter(
    (c) =>
      c.name.toLowerCase().includes(keyword) ||
      c.phone.includes(keyword)
  );
}

export async function addContact(name, phone, email = '', notes = '') {
  await initDatabase();
  const newContact = {
    id: Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    notes: notes.trim(),
    created_at: new Date().toISOString(),
  };

  memoryContacts = [...(memoryContacts || []), newContact];
  saveToStorage(STORAGE_KEYS.CONTACTS, memoryContacts);
  return newContact.id;
}

export async function updateContact(id, name, phone, email = '', notes = '') {
  await initDatabase();
  memoryContacts = (memoryContacts || []).map((c) =>
    c.id === id
      ? {
          ...c,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim(),
        }
      : c
  );
  saveToStorage(STORAGE_KEYS.CONTACTS, memoryContacts);
  return true;
}

export async function deleteContact(id) {
  await initDatabase();
  memoryContacts = (memoryContacts || []).filter((c) => c.id !== id);
  saveToStorage(STORAGE_KEYS.CONTACTS, memoryContacts);
  return true;
}
