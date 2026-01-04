import React, { useState } from 'react';

const StockControls = ({ item, onUpdate }) => {
    const [amount, setAmount] = useState('');

    const handleUpdate = (isAddition) => {
        const val = parseInt(amount);
        if (isNaN(val) || val <= 0) return;

        const adjustment = isAddition ? val : -val;
        const currentQty = Number(item.quantityAvailable) || 0;
        if (!isAddition && currentQty + adjustment < 0) {
            alert('Cannot reduce stock below zero.');
            return;
        }

        onUpdate(adjustment);
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
            <div className="flex gap-2">
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleUpdate(false)}
                    disabled={!amount || item.quantityAvailable === 0}
                    title="Use Stock"
                >
                    −
                </button>
                <button
                    className="btn btn-sm btn-primary"
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
