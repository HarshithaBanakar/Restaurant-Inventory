import React, { useState } from 'react';

const StockControls = ({ item, onUpdate }) => {
    const [amount, setAmount] = useState('');

    const handleUpdate = (isAddition) => {
        const val = parseInt(amount);
        if (isNaN(val) || val <= 0) return;

        // If subtracting, ensure we don't go below 0 (though logic also handles this)
        const adjustment = isAddition ? val : -val;

        if (!isAddition && item.quantityAvailable + adjustment < 0) {
            alert('Cannot reduce stock below zero.');
            return;
        }

        onUpdate(item.id, adjustment);
        setAmount('');
    };

    return (
        <div className="stock-controls">
            <input
                type="number"
                min="1"
                placeholder="Qty"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="stock-input"
            />
            <div className="button-group">
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleUpdate(false)}
                    disabled={!amount || item.quantityAvailable === 0}
                    title="Use Stock"
                >
                    -
                </button>
                <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleUpdate(true)}
                    disabled={!amount}
                    title="Add Stock"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default StockControls;
