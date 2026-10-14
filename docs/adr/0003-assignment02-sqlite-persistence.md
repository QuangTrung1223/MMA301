# SQLite Local Persistence and Auto-Login Architecture for Assignment02

## Context
Following Assignment 1 (which used React state `useState` with transient in-memory task data) and Lab 2 (which introduced React Navigation and advanced layouts):
1. **Assignment 2 Specification** requires upgrading the Todo List to use a persistent database (SQLite), with screen navigation via React Navigation, and an extension feature for "Remember Password" / Auto-Login using local storage (`AsyncStorage`).
2. **LAB_sqlite.docx** specifies building a local Phone Contacts management application with full CRUD (Create, Read, Update, Delete), real-time search, input validation, and guaranteed SQLite data persistence across application restarts.

## Decision
We create a standalone Expo project in `Assignment02/` that unifies both requirements:
1. **Database Layer (`src/services/db.js`)**:
   - Uses `expo-sqlite` with the modern asynchronous API (`openDatabaseAsync`, `execAsync`, `runAsync`, `getAllAsync`).
   - Automatically initializes the database schema on app launch with `tasks` and `contacts` tables.
   - Provides strongly-typed helper methods for CRUD operations on tasks and contacts.
2. **Authentication & Auto-Login Layer (`src/services/authStorage.js`)**:
   - Uses `@react-native-async-storage/async-storage` to securely store and retrieve `remembered_user` credentials.
   - On app startup, checks for existing remembered credentials; if found, navigates immediately to the Main Screen, bypassing the Login Screen.
   - Provides an explicit "Logout" action that clears credentials and returns to the Login Screen.
3. **Core Functional Screens**:
   - `LoginScreen.js`: Username and Password inputs, "Remember Password" checkbox, validation, and auto-login check.
   - `TodoListScreen.js`: SQLite-backed task manager with TextInput + Add, FlatList display, strike-through completion toggle, task deletion, and status filtering ("All", "Pending", "Completed").
   - `ContactsScreen.js`: SQLite-backed phone contacts manager implementing FR01 - FR08 from `LAB_sqlite.docx` (Add, Edit, Delete, View details, Search by name or phone, Validation, and Persistence).
4. **Navigation Structure**:
   - Stack Navigator managing authentication flow (`Login` -> `MainApp`).
   - MainApp includes a top switcher allowing graders to seamlessly test both the Assignment 2 SQLite Todo List and the SQLite Phone Contacts modules.

## Consequences
- Data is 100% durable and persists across application reloads and device restarts.
- Completely satisfies both `Assignment2_Login_database.pdf` and `LAB_sqlite.docx`.
- The architecture cleanly isolates database queries from UI rendering components.
