import * as SQLite from 'expo-sqlite';

/**
 * Native Android/iOS Implementation of Database Service for Assignment02
 * Sử dụng expo-sqlite với SQLite native engine trên thiết bị thật và máy ảo
 */

let dbInstance = null;

export async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync('mma301_app.db');
  }
  return dbInstance;
}

export async function initDatabase() {
  try {
    const db = await getDatabase();

    // 1. Tạo bảng tasks
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    // 2. Tạo bảng contacts (theo yêu cầu LAB_sqlite.docx)
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
      );
    `);

    // Chèn dữ liệu mẫu nếu bảng tasks trống
    const taskCountResult = await db.getFirstAsync('SELECT COUNT(*) as count FROM tasks;');
    if (taskCountResult && taskCountResult.count === 0) {
      await db.runAsync(
        'INSERT INTO tasks (title, completed, created_at) VALUES (?, ?, ?);',
        ['Học cú pháp JSX và Component trong React Native', 1, new Date().toISOString()]
      );
      await db.runAsync(
        'INSERT INTO tasks (title, completed, created_at) VALUES (?, ?, ?);',
        ['Thực hành quản lý State với SQLite database', 0, new Date().toISOString()]
      );
      await db.runAsync(
        'INSERT INTO tasks (title, completed, created_at) VALUES (?, ?, ?);',
        ['Hoàn thiện chức năng Auto-Login và Remember Password', 0, new Date().toISOString()]
      );
    }

    // Chèn dữ liệu mẫu nếu bảng contacts trống
    const contactCountResult = await db.getFirstAsync('SELECT COUNT(*) as count FROM contacts;');
    if (contactCountResult && contactCountResult.count === 0) {
      await db.runAsync(
        'INSERT INTO contacts (name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Nguyễn Văn Nam', '0987654321', 'namnv@fpt.edu.vn', 'Giảng viên MMA301', new Date().toISOString()]
      );
      await db.runAsync(
        'INSERT INTO contacts (name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Trần Thị Mai', '0912345678', 'maitt@gmail.com', 'Trưởng nhóm đồ án', new Date().toISOString()]
      );
      await db.runAsync(
        'INSERT INTO contacts (name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?);',
        ['Lê Hoàng Long', '0905123987', 'longlh@company.vn', 'Đồng nghiệp', new Date().toISOString()]
      );
    }

    return true;
  } catch (error) {
    console.error('Lỗi khởi tạo SQLite Database native:', error);
    throw error;
  }
}

export async function getTasks(filter = 'all') {
  const db = await getDatabase();
  let query = 'SELECT * FROM tasks ORDER BY id DESC;';

  if (filter === 'completed') {
    query = 'SELECT * FROM tasks WHERE completed = 1 ORDER BY id DESC;';
  } else if (filter === 'pending') {
    query = 'SELECT * FROM tasks WHERE completed = 0 ORDER BY id DESC;';
  }

  return await db.getAllAsync(query);
}

export async function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) return null;

  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, completed, created_at) VALUES (?, ?, ?);',
    [trimmed, 0, new Date().toISOString()]
  );
  return result.lastInsertRowId;
}

export async function toggleTaskCompletion(id, currentCompleted) {
  const newStatus = currentCompleted === 1 ? 0 : 1;
  const db = await getDatabase();
  await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?;', [newStatus, id]);
  return true;
}

export async function updateTaskTitle(id, newTitle) {
  const trimmed = newTitle.trim();
  if (!trimmed) return false;

  const db = await getDatabase();
  await db.runAsync('UPDATE tasks SET title = ? WHERE id = ?;', [trimmed, id]);
  return true;
}

export async function deleteTask(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?;', [id]);
  return true;
}

export async function getContacts(searchQuery = '') {
  const keyword = searchQuery.trim().toLowerCase();
  const db = await getDatabase();

  if (!keyword) {
    return await db.getAllAsync('SELECT * FROM contacts ORDER BY name ASC;');
  }

  return await db.getAllAsync(
    'SELECT * FROM contacts WHERE name LIKE ? OR phone LIKE ? ORDER BY name ASC;',
    [`%${keyword}%`, `%${keyword}%`]
  );
}

export async function addContact(name, phone, email = '', notes = '') {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO contacts (name, phone, email, notes, created_at) VALUES (?, ?, ?, ?, ?);',
    [name.trim(), phone.trim(), email.trim(), notes.trim(), new Date().toISOString()]
  );
  return result.lastInsertRowId;
}

export async function updateContact(id, name, phone, email = '', notes = '') {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE contacts SET name = ?, phone = ?, email = ?, notes = ? WHERE id = ?;',
    [name.trim(), phone.trim(), email.trim(), notes.trim(), id]
  );
  return true;
}

export async function deleteContact(id) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM contacts WHERE id = ?;', [id]);
  return true;
}
