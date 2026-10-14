# MMA301 Mobile Application Development

Domain concepts and terms used across the lab exercises and assignments for the MMA301 React Native coursework.

## Language

**Task**:
A single unit of work in the Task Manager displaying a title, completion toggle status, and deletion action.
_Avoid_: Todo item, note, job

**CartItem**:
An item in the Shopping Cart containing a title, product description, unit price, quantity counter, and selection status.
_Avoid_: Product, commodity, line item

**Selection**:
The state of a CartItem being selected via checkbox for bulk actions such as deletion.
_Avoid_: Checked, marked

**AuthCredential**:
User inputs (email and password) evaluated against specific validation constraints on the Login Screen.
_Avoid_: Account info, login input

**SectionGroup**:
A partitioned subset of list items in a `SectionList` categorized under a common section title.
_Avoid_: Category block, header group

**RouteParam**:
Payload data passed from an origin screen to a target screen during navigation transitions.
_Avoid_: Query param, intent extra, screen prop

**DrawerLayout**:
A lateral slide-out navigation panel providing access to destination views and actions.
_Avoid_: Sidebar, hamburger flyout

**SafeArea**:
The renderable area of a mobile screen guaranteed not to be clipped by physical hardware cutouts, status bars, or home indicator bars.
_Avoid_: Margin box, screen padding

**TaskRecord**:
A persistent database record in the SQLite database representing a task with id, title, completed status (stored as integer 0/1), and creation timestamp.
_Avoid_: Row item, entry

**ContactRecord**:
A persistent phone contact entity in the SQLite database containing name, phone number, email, and optional notes.
_Avoid_: Phone entry, address book item

**RememberCredential**:
Stored authentication credentials preserved in local device storage allowing automatic authentication on subsequent application launches.
_Avoid_: Saved cookie, auto token

**DatabaseContext**:
The asynchronous SQLite database lifecycle manager providing CRUD query execution and transaction handling for mobile components.
_Avoid_: SQL wrapper, DB helper


