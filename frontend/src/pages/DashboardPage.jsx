import React from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { stats, inventory } = useInventoryContext();

    // Get recently added (last 5)
    const recentItems = [...inventory].reverse().slice(0, 5);

    return (
        <div className="dashboard-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="text-muted">Monitor and manage your restaurant inventory health.</p>
                </div>
                <Link to="/inventory/add" className="btn btn-primary">
                    <span className="icon">+</span> Add New Item
                </Link>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Items</h3>
                    <div className="value">{stats.totalItems}</div>
                    <div className="stat-footer text-muted">Items in catalog</div>
                </div>
                <div className={`stat-card ${stats.available > 0 ? 'border-success' : ''}`}>
                    <h3>Stable Stock</h3>
                    <div className="value text-success">{stats.available}</div>
                    <div className="stat-footer text-muted">Items above reorder level</div>
                </div>
                <div className={`stat-card ${stats.lowStock > 0 ? 'border-warning shadow-warning' : ''}`}>
                    <h3>Low Stock</h3>
                    <div className="value text-warning">{stats.lowStock}</div>
                    <div className="stat-footer text-muted">Requires attention soon</div>
                </div>
                <div className={`stat-card ${stats.outOfStock > 0 ? 'border-danger shadow-danger' : ''}`}>
                    <h3>Out of Stock</h3>
                    <div className="value text-danger">{stats.outOfStock}</div>
                    <div className="stat-footer text-muted">Critical action required</div>
                </div>
            </div>

            <div className="section mt-4">
                <div className="flex items-center justify-between mb-4">
                    <h2>Recent Activity</h2>
                    <Link to="/inventory" className="btn btn-secondary btn-sm">View All</Link>
                </div>
                <div className="card">
                    {recentItems.length === 0 ? (
                        <div className="p-8 text-center text-muted">
                            <p>No inventory items found. Start by adding your first item.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="clean-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Status</th>
                                        <th>Quantity</th>
                                        <th>Health</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentItems.map(item => {
                                        const qty = Number(item.quantityAvailable) || 0;
                                        const level = Number(item.reorderLevel) || 0;
                                        const isLow = qty <= level && qty > 0;
                                        const isOut = qty === 0;
                                        const statusClass = isOut ? 'out-of-stock' : isLow ? 'low-stock' : 'available';
                                        const healthPercent = Math.min(100, (qty / (level * 2 || 1)) * 100);

                                        return (
                                            <tr key={item.id || item._id}>
                                                <td><div className="item-name">{item.itemName}</div></td>
                                                <td>
                                                    <span className={`status-badge badge-${isOut ? 'danger' : isLow ? 'warning' : 'success'}`}>
                                                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Stable'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="font-600">{item.quantityAvailable}</span> {item.unit}
                                                </td>
                                                <td style={{ width: '150px' }}>
                                                    <div className="health-bar-container">
                                                        <div
                                                            className={`health-bar ${statusClass}`}
                                                            style={{ width: `${healthPercent}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
