import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import InventoryListPage from './pages/InventoryListPage';
import InventoryFormPage from './pages/InventoryFormPage';

function App() {
    return (
        <InventoryProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="inventory" element={<InventoryListPage />} />
                        <Route path="inventory/add" element={<InventoryFormPage />} />
                        <Route path="inventory/edit/:id" element={<InventoryFormPage />} />
                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </InventoryProvider>
    );
}

export default App;
