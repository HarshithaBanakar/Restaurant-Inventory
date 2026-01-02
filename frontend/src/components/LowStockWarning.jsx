import React from 'react';

const LowStockWarning = ({ item }) => {
    if (item.quantityAvailable > item.reorderLevel) return null;

    const isCritical = item.quantityAvailable === 0;

    return (
        <div className={`low-stock-warning ${isCritical ? 'critical' : 'warning'}`}>
            <span className="icon">⚠</span>
            <span>
                {isCritical
                    ? `CRITICAL: ${item.itemName} is Out of Stock!`
                    : `Low Stock: ${item.itemName} is below reorder level (${item.reorderLevel} ${item.unit})`}
            </span>
        </div>
    );
};

export default LowStockWarning;
