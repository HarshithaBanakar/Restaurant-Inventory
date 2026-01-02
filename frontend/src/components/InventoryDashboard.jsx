import React from 'react';
import { useInventory } from '../hooks/useInventory';
import InventoryTable from './InventoryTable';

const InventoryDashboard = () => {
    const { inventory, updateStock } = useInventory();

    // Calculate quick stats
    const lowStockCount = inventory.filter(i => i.stockStatus === 'Low Stock' || i.stockStatus === 'Out of Stock').length;
    const totalItems = inventory.length;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <h2>Inventory Overview</h2>
                    <div className="stats-bar">
                        <div className="stat-item">
                            <span className="stat-label">Total Items</span>
                            <span className="stat-value">{totalItems}</span>
                        </div>
                        <div className="stat-item warning">
                            <span className="stat-label">Low Stock Alerts</span>
                            <span className="stat-value">{lowStockCount}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="content-card">
                    <InventoryTable inventory={inventory} onUpdateStock={updateStock} />
                </div>
            </main>
        </div>
    );
};

export default InventoryDashboard;
