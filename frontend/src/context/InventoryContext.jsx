import React, { createContext, useContext, useState, useEffect } from 'react';

const InventoryContext = createContext();

const API_Base = '/api/inventory';

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    // Fetch Inventory
    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_Base, {
                headers: getHeaders()
            });
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
        // Only fetch if token exists (optional optimization, but fetchInventory will just fail if not authorized anyway)
        fetchInventory();
    }, []);

    // Add Item
    const addItem = async (newItem) => {
        try {
            const response = await fetch(API_Base, {
                method: 'POST',
                headers: getHeaders(),
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
            // Ensure numbers are sent as numbers
            const payload = { ...updatedFields };
            if (payload.quantityAvailable !== undefined) payload.quantityAvailable = Number(payload.quantityAvailable);
            if (payload.reorderLevel !== undefined) payload.reorderLevel = Number(payload.reorderLevel);

            const response = await fetch(`${API_Base}/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to update item');
            const data = await response.json();

            // Standardization: data from backend has standardized .id
            setInventory(prev => prev.map(item => (item.id === id || item._id === id) ? data : item));
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
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error('Failed to delete item');

            setInventory(prev => prev.filter(item => (item.id !== id && item._id !== id)));
            return true;
        } catch (err) {
            console.error(err);
            alert('Error deleting item: ' + err.message);
            return false;
        }
    };

    // Stock Usage (Increment/Decrement)
    const updateStock = async (id, adjustment) => {
        const item = inventory.find(i => (i.id === id || i._id === id));
        if (!item) return;

        // Force numeric calculation
        const currentQty = Number(item.quantityAvailable) || 0;
        const newQty = Math.max(0, currentQty + Number(adjustment));

        try {
            await updateItem(id, { quantityAvailable: newQty });
        } catch (err) {
            // Error handled in updateItem
        }
    };

    // Stats with logic derived directly from inventory data
    // Ensure numeric comparison
    const stats = {
        totalItems: inventory.length,
        available: inventory.filter(i => Number(i.quantityAvailable) > Number(i.reorderLevel)).length,
        lowStock: inventory.filter(i => {
            const qty = Number(i.quantityAvailable);
            const level = Number(i.reorderLevel);
            return qty <= level && qty > 0;
        }).length,
        outOfStock: inventory.filter(i => Number(i.quantityAvailable) === 0).length,
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
