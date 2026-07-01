# Cyber Zone - Security Portal Dashboard

Cyber Zone is a responsive, feature-rich cybersecurity management portal and dashboard designed to visualize security logs, manage roles & permissions, handle file uploads, and showcase simulated database interactions.

To make hosting and demonstrations seamless, this project runs as a **fully client-side static application**. It utilizes a built-in local database engine that persists data directly inside the browser's `localStorage`, allowing full CRUD operations, role-based access, and login sessions without requiring an external backend or database server.

---

## 🚀 Key Features

*   📊 **Analytics Dashboard**: Live overview statistics including user counts, visitor count, report statistics, and file storage distribution.
*   🔒 **Simulated User Authentication**: Registration, secure login, and session persistence (utilizing SHA-256 for passwords).
*   🎭 **Role-Based Access Control (RBAC)**: Manage and edit permissions for `Admin`, `Editor`, and `Viewer` roles dynamically.
*   👥 **User Management Dashboard**: Fully functional CRUD panel for creating, editing, suspending, or deleting users.
*   📁 **File Uploads**: Simulated file uploads (with file size, type tracking, and base64 preview logic) and downloads.
*   📃 **Report Generation**: Security report panel with creation and deletion of audit/vulnerability records.
*   💾 **Backup & Restore**: Export the entire state of your simulated database as a JSON file and import it back at any time.
*   🛡️ **Security Validation Engine**: Simulated security filters to detect and prevent XSS (Cross-Site Scripting) and SQL Injection (SQLi) patterns in input fields.

---

## 🛠️ Tech Stack & Architecture

*   **Bundler/Dev Server**: [Vite](https://vitejs.dev/)
*   **Structure**: Semantic HTML5 Layouts
*   **Styling**: Pure CSS3 with custom CSS variable-based design systems
*   **State & Database Management**: Simulated `localStorage` relational-style engine inside [db.js](file:///d:/operation%20-%20Copy/public/assets/js/db.js).

---

## 🏁 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Setup and Installation

1. Clone this repository to your local machine.
2. Navigate to the root directory.
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the local Vite development server:
```bash
npm run dev
```
The application will open automatically in your browser at `http://localhost:5173`.

### Building for Production

To build the optimized static assets (ready to be deployed to GitHub Pages, Netlify, Vercel, etc.):
```bash
npm run build
```
The built assets will be generated in the `dist/` directory.
