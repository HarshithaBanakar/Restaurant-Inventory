import React from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import { Link, useNavigate } from 'react-router-dom';
import StockControls from '../components/StockControls';
import StatusBadge from '../components/StatusBadge';
import LowStockWarning from '../components/LowStockWarning';

const InventoryListPage = () => {
    const { inventory, updateStock, deleteItem } = useInventoryContext();
    const navigate = useNavigate();

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItem(id);
        }
    };

    return (
        <div className="list-page">
            <header className="page-header">
                <h1>Inventory List</h1>
                <Link to="/inventory/add" className="btn btn-primary">
                    + Add Item
                </Link>
            </header>

            <div className="card">
                {inventory.length === 0 ? (
                    <div className="empty-state">
                        <p>Your inventory is empty.</p>
                        <Link to="/inventory/add" className="btn btn-outline">Start Adding Items</Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Stock Actions</th>
                                    <th>Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory.map(item => (
                                    <tr key={item.id} className={item.stockStatus === 'Out of Stock' ? 'row-critical' : ''}>
                                        <td>
                                            <div className="item-name">{item.itemName}</div>
                                            <LowStockWarning item={item} />
                                        </td>
                                        <td><span className="category-pill">{item.category}</span></td>
                                        <td>
                                            <span className="qty-value">{item.quantityAvailable}</span> {item.unit}
                                        </td>
                                        <td><StatusBadge status={item.stockStatus} /></td>
                                        <td>
                                            <StockControls item={item} onUpdate={updateStock} />
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-icon btn-edit"
                                                    onClick={() => navigate(`/inventory/edit/${item.id}`)}
                                                    title="Edit"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    className="btn btn-icon btn-delete"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Delete"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryListPage;
