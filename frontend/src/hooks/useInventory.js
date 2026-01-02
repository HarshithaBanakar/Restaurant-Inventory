import { useState, useCallback } from 'react';

const INITIAL_INVENTORY = [
    { id: 1, itemName: 'Tomato Sauce', category: 'Pantry', quantityAvailable: 20, unit: 'cans', reorderLevel: 5, stockStatus: 'Available' },
    { id: 2, itemName: 'Mozzarella Cheese', category: 'Refrigerated', quantityAvailable: 8, unit: 'kg', reorderLevel: 10, stockStatus: 'Low Stock' },
    { id: 3, itemName: 'Flour', category: 'Pantry', quantityAvailable: 50, unit: 'kg', reorderLevel: 15, stockStatus: 'Available' },
    { id: 4, itemName: 'Olive Oil', category: 'Pantry', quantityAvailable: 12, unit: 'liters', reorderLevel: 5, stockStatus: 'Available' },
    { id: 5, itemName: 'Fresh Basil', category: 'Produce', quantityAvailable: 2, unit: 'bunches', reorderLevel: 5, stockStatus: 'Low Stock' },
    { id: 6, itemName: 'Pepperoni', category: 'Refrigerated', quantityAvailable: 15, unit: 'kg', reorderLevel: 5, stockStatus: 'Available' },
    { id: 7, itemName: 'Pizza Dough', category: 'Refrigerated', quantityAvailable: 0, unit: 'kg', reorderLevel: 20, stockStatus: 'Out of Stock' },
];

export const useInventory = () => {
    const [inventory, setInventory] = useState(INITIAL_INVENTORY);

    const updateStock = useCallback((id, updates) => {
        setInventory(prev => prev.map(item => {
            if (item.id !== id) return item;

            const newItem = { ...item, ...updates };

            // Adjust quantity based on specific numeric updates if provided
            if (typeof updates.adjustQuantity === 'number') {
                newItem.quantityAvailable = Math.max(0, item.quantityAvailable + updates.adjustQuantity);
                delete newItem.adjustQuantity; // Clean up helper prop
            }

            // Auto-calculate status
            if (newItem.quantityAvailable === 0) {
                newItem.stockStatus = 'Out of Stock';
            } else if (newItem.quantityAvailable <= newItem.reorderLevel) {
                newItem.stockStatus = 'Low Stock';
            } else {
                newItem.stockStatus = 'Available';
            }

            return newItem;
        }));
    }, []);

    return {
        inventory,
        updateStock
    };
};
