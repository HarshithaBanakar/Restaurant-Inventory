import React, { useMemo } from 'react';
import { useInventoryContext } from '../context/InventoryContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import StockControls from '../components/StockControls';

const InventoryListPage = () => {
    const { inventory, updateStock, deleteItem } = useInventoryContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Get filter from query params
    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get('filter');

    const filteredInventory = useMemo(() => {
        if (filter === 'low') {
            return inventory.filter(item => {
                const qty = Number(item.quantityAvailable);
                const level = Number(item.reorderLevel);
                return qty <= level && qty > 0;
            });
        }
        if (filter === 'out') {
            return inventory.filter(item => Number(item.quantityAvailable) === 0);
        }
        return inventory;
    }, [inventory, filter]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItem(id);
        }
    };

    const getPageTitle = () => {
        if (filter === 'low') return 'Low Stock Inventory';
        if (filter === 'out') return 'Out of Stock Items';
        return 'All Inventory';
    };

    return (
        <div className="list-page animate-fade-in">
            <header className="page-header">
                <div>
                    <h1>{getPageTitle()}</h1>
                    <p className="text-muted">Total items shown: {filteredInventory.length}</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/inventory/add" className="btn btn-primary">
                        <span className="icon">+</span> Add Item
                    </Link>
                </div>
            </header>

            <div className="card">
                {filteredInventory.length === 0 ? (
                    <div className="p-12 text-center text-muted">
                        <div className="mb-4" style={{ fontSize: '3rem' }}>🔍</div>
                        <h3>No items found</h3>
                        <p>Try changing your filters or add a new item.</p>
                        {filter && <Link to="/inventory" className="btn btn-secondary mt-4">Clear Filters</Link>}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="inventory-table">
                            <thead>
                                <tr>
                                    <th>Item Details</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Stock Health</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map(item => {
                                    const qty = Number(item.quantityAvailable);
                                    const level = Number(item.reorderLevel);
                                    const isLow = qty <= level && qty > 0;
                                    const isOut = qty === 0;
                                    const statusClass = isOut ? 'out-of-stock' : isLow ? 'low-stock' : 'available';

                                    return (
                                        <tr key={item.id || item._id} className={isOut ? 'row-critical' : isLow ? 'row-warning' : ''}>
                                            <td>
                                                <div className="item-details">
                                                    <div className="item-name">{item.itemName}</div>
                                                    <div className="item-meta text-muted">
                                                        Reorder at: {item.reorderLevel} {item.unit}
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span className="category-pill">{item.category}</span></td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <span className={`qty-display ${statusClass}`}>
                                                        {item.quantityAvailable} {item.unit}
                                                    </span>
                                                    <StockControls item={item} onUpdate={(val) => updateStock(item.id || item._id, val)} />
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge badge-${isOut ? 'danger' : isLow ? 'warning' : 'success'}`}>
                                                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Stable'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-icon"
                                                        onClick={() => navigate(`/inventory/edit/${item.id || item._id}`)}
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryListPage;
