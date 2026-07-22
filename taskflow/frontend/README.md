# ⚡ TaskFlow – AI-Powered Productivity & Task Management Platform

TaskFlow is a modern, 100% Client-Side SaaS Task Management & Productivity Application built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**. It operates completely inside the browser using `localStorage`, eliminating the need for any external backend or database, making it 100% Netlify ready!

![TaskFlow Platform](https://img.shields.io/badge/React-18.2-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.2-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)
![Netlify Ready](https://img.shields.io/badge/Netlify-Ready-00C7B7?logo=netlify)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

* 📋 **Task Management & Subtasks**: Create, edit, delete, duplicate, and filter tasks. Supports unlimited subtask checklists with live percentage completion bars.
* 🎛️ **Kanban Board**: Drag-and-drop columns (`Todo`, `In Progress`, `Review`, `Completed`) with real-time status updates.
* 📅 **Task Calendar**: Interactive Month, Week, and Day scheduled view with date range pickers.
* ⏱️ **Pomodoro Focus Suite**: 25m Focus / 5m Short Break / 15m Long Break timer with Web Audio API chime sounds.
* 🤖 **Client-Side AI Assistant**: Parses plain language sentences (e.g. *"Build React app by Friday with auth and dashboard"*) into structured subtask checklists directly inside your browser.
* 🏅 **Badges & Streak System**: Daily streak counter and milestone badges saved automatically to `localStorage`.
* 📊 **Analytics Hub**: Recharts visualizations for task completion trends, priority distribution, and category breakdowns.
* 📤 **Data Export**: Export task repositories to CSV/Excel or JSON format with one click.
* 🌙 **Dark & Light Mode**: Persistent glassmorphic dark/light theme toggle.
* 📱 **PWA Support**: Web App Manifest & Service Worker configured for offline capabilities.

---

## 🛠️ Tech Stack

* **Core Framework**: React.js (Vite)
* **Styling & Design**: Tailwind CSS, Glassmorphic Tokens, Lucide Icons
* **Animations**: Framer Motion & CSS Micro-Interactions
* **Charts & Data**: Recharts
* **State & Persistence**: React Context API & `localStorage`
* **Deployment**: Netlify Ready (SPA Configured)

---

## 📁 Project Structure

```
taskflow/
├── dist/                 # Production distribution build (generated via npm run build)
├── public/
│   ├── _redirects        # Netlify SPA routing rules
│   ├── manifest.json     # Progressive Web App manifest
│   └── sw.js             # Service Worker offline cache
├── src/
│   ├── components/
│   │   ├── ai/           # AI Task Generator Modal
│   │   ├── analytics/    # Recharts Productivity Graphs
│   │   ├── badges/       # Achievement Showcase
│   │   ├── calendar/     # Interactive Task Calendar
│   │   ├── common/       # Toast & CSV Export Modals
│   │   ├── layout/       # Glassmorphism Navbar & Sidebar
│   │   ├── pomodoro/     # Focus Timer
│   │   └── tasks/        # Kanban Board, Task List & Subtask Progress
│   ├── context/          # Auth, Task, and Theme Context Providers
│   ├── services/         # Client-side AI NLP Parser Engine
│   ├── utils/            # LocalStorage persistence & seed data
│   ├── App.jsx           # Main Application & Router
│   └── index.css         # Tailwind & Glassmorphism utility classes
├── netlify.toml          # Netlify build & redirect rules
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v16 or higher)
* npm (v8 or higher)

### Setup Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/taskflow.git
   cd taskflow
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.

---

## 🌐 How to Deploy on Netlify

### Option 1: Automatic Git Deployment (Recommended)

1. Push this repository to GitHub.
2. Sign in to [Netlify.com](https://netlify.com) and click **Add new site** → **Import an existing project**.
3. Select **GitHub** and choose your `taskflow` repository.
4. Set build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
5. Click **Deploy Site**.

### Option 2: Manual Drag & Drop Deployment

1. Build the production package locally:
   ```bash
   npm run build
   ```
2. Go to [Netlify.com](https://netlify.com) -> **Sites**.
3. Drag and drop the `dist` folder into the Netlify deployment zone.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
