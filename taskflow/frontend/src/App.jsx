import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { TaskContext, TaskProvider } from './context/TaskContext';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { ExportModal } from './components/common/ExportModal';
import { TaskModal } from './components/tasks/TaskModal';
import { AITaskModal } from './components/ai/AITaskModal';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { FocusPage } from './pages/FocusPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BadgesPage } from './pages/BadgesPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] text-slate-400 text-xs font-semibold">
        Loading TaskFlow Platform...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function MainLayout() {
  const { toastMessage, showToast } = useContext(TaskContext);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('Todo');
  const [isAITaskModalOpen, setIsAITaskModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleOpenTaskModal = (status = 'Todo') => {
    setEditingTask(null);
    setDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-[#0b0f19] text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenAITaskModal={() => setIsAITaskModalOpen(true)}
          onOpenTaskModal={handleOpenTaskModal}
          onOpenExportModal={() => setIsExportModalOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<DashboardPage onOpenTaskModal={handleOpenTaskModal} onOpenAITaskModal={() => setIsAITaskModalOpen(true)} onEditTask={handleEditTask} />} />
            <Route path="/tasks" element={<TasksPage onOpenTaskModal={handleOpenTaskModal} onOpenAITaskModal={() => setIsAITaskModalOpen(true)} onEditTask={handleEditTask} />} />
            <Route path="/calendar" element={<CalendarPage onEditTask={handleEditTask} />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/workspaces" element={<WorkspacePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTask={editingTask}
        defaultStatus={defaultStatus}
      />
      <AITaskModal
        isOpen={isAITaskModalOpen}
        onClose={() => setIsAITaskModalOpen(false)}
      />
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
      {toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type}
          onClose={() => showToast(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
