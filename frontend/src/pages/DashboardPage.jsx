import React from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { stats, inventory } = useInventoryContext();

    // Get recently added (last 5)
    const recentItems = [...inventory].reverse().slice(0, 5);

    return (
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Dashboard Overview</h1>
                <Link to="/inventory/add" className="btn btn-primary">
                    + Add New Item
                </Link>
            </header>

            <div className="stats-grid">
                <div className="stat-card blue">
                    <h3>Total Items</h3>
                    <div className="value">{stats.totalItems}</div>
                </div>
                <div className={`stat-card ${stats.lowStock > 0 ? 'yellow' : 'green'}`}>
                    <h3>Low Stock Alerts</h3>
                    <div className="value">{stats.lowStock}</div>
                </div>
                <div className={`stat-card ${stats.outOfStock > 0 ? 'red' : 'green'}`}>
                    <h3>Out of Stock</h3>
                    <div className="value">{stats.outOfStock}</div>
                </div>
            </div>

            <div className="section mt-4">
                <h2>Recent Activity</h2>
                <div className="card">
                    {recentItems.length === 0 ? (
                        <p className="p-4 text-muted">No items found.</p>
                    ) : (
                        <table className="clean-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Status</th>
                                    <th>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.itemName}</td>
                                        <td>
                                            <span className={`status-dot ${item.stockStatus.toLowerCase().replace(/ /g, '-')}`}></span>
                                            {item.stockStatus}
                                        </td>
                                        <td>{item.quantityAvailable} {item.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="card-footer">
                        <Link to="/inventory">View All Inventory &rarr;</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
