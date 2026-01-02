import React from 'react';
import StatusBadge from './StatusBadge';
import StockControls from './StockControls';
import LowStockWarning from './LowStockWarning';

const InventoryTable = ({ inventory, onUpdateStock }) => {
    if (!inventory || inventory.length === 0) {
        return <div className="empty-state">No inventory items found.</div>;
    }

    return (
        <div className="table-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Reorder Level</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id} className={item.stockStatus === 'Low Stock' || item.stockStatus === 'Out of Stock' ? 'row-warning' : ''}>
                            <td>
                                <div className="item-name">{item.itemName}</div>
                                <LowStockWarning item={item} />
                            </td>
                            <td><span className="category-tag">{item.category}</span></td>
                            <td>
                                <span className="quantity-display">
                                    {item.quantityAvailable} <small>{item.unit}</small>
                                </span>
                            </td>
                            <td>{item.reorderLevel} {item.unit}</td>
                            <td><StatusBadge status={item.stockStatus} /></td>
                            <td>
                                <StockControls item={item} onUpdate={onUpdateStock} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
