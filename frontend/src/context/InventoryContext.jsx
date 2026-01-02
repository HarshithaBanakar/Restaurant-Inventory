import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

const API_Base = 'http://localhost:5000/api/inventory';

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Inventory
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_Base);
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setInventory(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Add Item
    const addItem = async (newItem) => {
        try {
            const response = await fetch(API_Base, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (!response.ok) throw new Error('Failed to add item');
            const data = await response.json();

            setInventory(prev => [...prev, data]);
            return true;
        } catch (err) {
            console.error(err);
            alert('Error adding item: ' + err.message);
            return false;
        }
    };

    // Update Item
    const updateItem = async (id, updatedFields) => {
        try {
            const response = await fetch(`${API_Base}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFields)
            });

            if (!response.ok) throw new Error('Failed to update item');
            const data = await response.json();

            setInventory(prev => prev.map(item => item.id === id ? data : item));
            return true;
        } catch (err) {
            console.error(err);
            alert('Error updating item: ' + err.message);
            return false;
        }
    };

    // Delete Item
    const deleteItem = async (id) => {
        try {
            const response = await fetch(`${API_Base}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete item');

            setInventory(prev => prev.filter(item => item.id !== id));
            return true;
        } catch (err) {
            console.error(err);
            alert('Error deleting item: ' + err.message);
            return false;
        }
    };

    // Stock Usage (Increment/Decrement)
    const updateStock = async (id, adjustment) => {
        // Find current item to calculate new quantity speculatively or let server handle
        // Better to let server handle, but we need to pass the NEW Quantity usually or the adjustment
        // Our backend route handles partial updates. Let's calculate new qty here to send it.
        const item = inventory.find(i => i.id === id);
        if (!item) return;

        const newQty = Math.max(0, item.quantityAvailable + adjustment);

        try {
            await updateItem(id, { quantityAvailable: newQty });
        } catch (err) {
            // Error handled in updateItem
        }
    };

    // Stats
    const stats = {
        totalItems: inventory.length,
        lowStock: inventory.filter(i => i.stockStatus === 'Low Stock').length,
        outOfStock: inventory.filter(i => i.stockStatus === 'Out of Stock').length,
    };

    return (
        <InventoryContext.Provider value={{
            inventory,
            loading,
            error,
            addItem,
            updateItem,
            deleteItem,
            updateStock,
            stats,
            fetchInventory
        }}>
            {children}
        </InventoryContext.Provider>
    );
};

export const useInventoryContext = () => {
    const context = useContext(InventoryContext);
    if (!context) {
        throw new Error('useInventoryContext must be used within an InventoryProvider');
    }
    return context;
};
