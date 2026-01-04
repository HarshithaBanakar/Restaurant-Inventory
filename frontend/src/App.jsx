import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import Layout from './components/Layout';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InventoryListPage from './pages/InventoryListPage';
import InventoryFormPage from './pages/InventoryFormPage';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/welcome" />;

    return children;
};

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (user) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <AuthProvider>
            <InventoryProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/welcome" element={
                            <PublicRoute><WelcomePage /></PublicRoute>
                        } />
                        <Route path="/login" element={
                            <PublicRoute><LoginPage /></PublicRoute>
                        } />
                        <Route path="/signup" element={
                            <PublicRoute><SignupPage /></PublicRoute>
                        } />

                        <Route path="/" element={
                            <ProtectedRoute><Layout /></ProtectedRoute>
                        }>
                            <Route index element={<DashboardPage />} />
                            <Route path="inventory" element={<InventoryListPage />} />
                            <Route path="inventory/add" element={<InventoryFormPage />} />
                            <Route path="inventory/edit/:id" element={<InventoryFormPage />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </InventoryProvider>
        </AuthProvider>
    );
}

export default App;
