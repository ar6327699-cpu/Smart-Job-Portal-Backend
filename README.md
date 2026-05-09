# 🚀 AI-Powered Smart Job Portal (Full-Stack)

A futuristic, high-performance, and visually stunning full-stack job portal featuring **AI-driven automatic job applications** based on semantic skill matchmaking. Built with **React (Vite)** on the frontend and **Django REST Framework (DRF)** on the backend.

---

## 🌟 Key Features

### 1. 🤖 AI Auto-Apply Matching Engine (Backend)
*   **Intelligent Automation:** Powered by Django `post_save` signals. Whenever an employer publishes a new job, the backend dynamically calculates a skill-match percentage for all candidates who have enabled Auto-Apply.
*   **Threshold Triggering:** If a candidate's comma-separated profile skills (e.g., `Python, Django, React, AWS`) have a **50% or higher match** with the published job title and description, the engine automatically creates a job application on their behalf.
*   **Instant Notifications:** Matches immediately dispatch automated, professional email updates to candidates notifying them of successful submissions!

### 2. 🎨 Premium Glassmorphism UI/UX (Frontend)
*   **Modern Aesthetic:** Implements an ultra-modern dark theme with glowing ambient radial backgrounds, delicate glassmorphic cards, linear gradients, and responsive grids.
*   **Micro-Animations:** Fluid transitions, hover scaling, glowing custom sliding toggles for Auto-Apply configuration, and seamless active navigation glows.
*   **Responsive Role-Selector:** Seamless registration with tile selectors to easily sign up as either a **Job Seeker** or an **Employer**.

### 3. 💼 Employer CRUD & Active Sourcing Cockpit
*   **Complete Job CRUD Controls:** Employers have complete capability to create, read, update, and delete listings. Edits take place using a fluid inline edit form directly inside the detail view!
*   **Strict Security:** Custom backend permission overrides (`perform_update`, `perform_destroy`) ensure only the owner of a job listing can edit or delete it.
*   **Sourcing Shortcuts:** List of applicants displays key matching tags, candidate biographies, and direct clickable contact links (**Mail Icon** to launch email client, **Phone Icon** to initiate call or WhatsApp).

---

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite (Fast Compilation), Custom CSS3 variables, Lucide React (vector-based clean iconography)
*   **Backend:** Django 5.x, Django REST Framework (DRF), Django Signal Observers
*   **Authentication:** DRF Token Authentication (secure local storage sessions)
*   **Database:** SQLite (development-optimized)

---

## 📂 Repository Structure

```text
├── frontend/             # React (Vite) client-side source code
│   ├── src/              # Components, Page layouts, assets, styles
│   └── package.json      # Frontend package configuration
├── job_portal/           # Django REST API backend source code
│   ├── app/              # Accounts (Users) and Jobs (Listings, Applications, Signals)
│   ├── core/             # Project settings, URL routers, ASGI configurations
│   └── manage.py         # Django administrative entrypoint
└── .gitignore            # Master gitignore for both systems
```

---

## 🚀 Setup & Installation Guide

### 1. Backend Setup (Django)

Ensure you have **Python 3.10+** installed.

```bash
# Navigate to backend directory
cd job_portal

# Install dependencies
pip install -r requirements.txt

# Run migrations (Creates fresh database structure)
python manage.py migrate

# Start backend server
python manage.py runserver
```
The server will start running on **`http://localhost:8000/`**.

---

### 2. Frontend Setup (React)

Ensure you have **Node.js 18+** installed.

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The client will start running on **`http://localhost:5173/`**.

---

## 🧼 Database Reset & Clean Slate

To clear the entire database and start completely fresh:

```bash
# Stop backend server
# Delete SQLite file inside job_portal directory
rm db.sqlite3

# Run migrations to recreate clean empty tables
python manage.py migrate

# Restart Django server
python manage.py runserver
```
*Note: Because of the master `.gitignore` configuration, your local `db.sqlite3` database file and confidential `.env` credentials are kept secure and are never pushed to GitHub.*

---

## 📝 Learning Objectives (Practice Project)
This repository was developed as a hands-on **practice project** dedicated to:
1.  Mastering React to Django REST API integrations, cross-origin request policies, and secure state management.
2.  Implementing asynchronous background triggers using native Django Database signals.
3.  Designing professional-grade, bespoke responsive dark mode layouts from scratch.
