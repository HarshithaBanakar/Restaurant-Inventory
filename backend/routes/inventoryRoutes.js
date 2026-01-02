const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/inventoryModel');

// Helper to calculate status
const calculateStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorderLevel) return 'Low Stock';
    return 'Available';
};

// GET /inventory - Fetch all items
router.get('/inventory', async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ itemName: 1 });
        // Enhance items with id (standardize _id to id for frontend if needed, methods work with _id usually but frontend used id)
        // We will stick to the frontend expecting 'id' potentially, but MongoDB uses '_id'.
        // Let's map it to keep frontend happy if it relies on 'id'.
        const formattedItems = items.map(item => ({
            ...item.toObject(),
            id: item._id // Map _id to id
        }));
        res.json(formattedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /inventory - Add new item
router.post('/inventory', async (req, res) => {
    try {
        const { itemName, category, quantityAvailable, unit, reorderLevel } = req.body;

        const stockStatus = calculateStatus(quantityAvailable, reorderLevel);

        const newItem = new InventoryItem({
            itemName,
            category,
            quantityAvailable,
            unit,
            reorderLevel,
            stockStatus
        });

        const savedItem = await newItem.save();
        res.status(201).json({ ...savedItem.toObject(), id: savedItem._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /inventory/:id - Update item
router.put('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If updating quantities, recalculate status
        if (updates.quantityAvailable !== undefined || updates.reorderLevel !== undefined) {
            // We need to know current values if only one is passed, but generally we expect full object or specific patch
            // For simplicity, let's assume we fetch, merge, calculate
            const currentItem = await InventoryItem.findById(id);
            if (!currentItem) return res.status(404).json({ message: 'Item not found' });

            const newQty = updates.quantityAvailable !== undefined ? updates.quantityAvailable : currentItem.quantityAvailable;
            const newLevel = updates.reorderLevel !== undefined ? updates.reorderLevel : currentItem.reorderLevel;

            updates.stockStatus = calculateStatus(newQty, newLevel);
        }

        const updatedItem = await InventoryItem.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });

        res.json({ ...updatedItem.toObject(), id: updatedItem._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /inventory/:id - Delete item
router.delete('/inventory/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await InventoryItem.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
