const express = require('express');
const router = express.Router();
const InventoryItem = require('../models/inventoryModel');
const { protect } = require('../middleware/authMiddleware');

// Helper to calculate status
const calculateStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorderLevel) return 'Low Stock';
    return 'Available';
};

// GET /inventory - Fetch all items
router.get('/inventory', protect, async (req, res) => {
    try {
        const items = await InventoryItem.find().sort({ itemName: 1 });
        const formattedItems = items.map(item => {
            const obj = item.toObject();
            return {
                ...obj,
                id: obj._id.toString(),
                quantityAvailable: Number(obj.quantityAvailable),
                reorderLevel: Number(obj.reorderLevel)
            };
        });
        res.json(formattedItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /inventory - Add new item
router.post('/inventory', protect, async (req, res) => {
    try {
        const { itemName, category, quantityAvailable, unit, reorderLevel } = req.body;
        const qty = Number(quantityAvailable) || 0;
        const level = Number(reorderLevel) || 0;

        const stockStatus = calculateStatus(qty, level);

        const newItem = new InventoryItem({
            itemName,
            category,
            quantityAvailable: qty,
            unit,
            reorderLevel: level,
            stockStatus
        });

        const savedItem = await newItem.save();
        const obj = savedItem.toObject();
        res.status(201).json({
            ...obj,
            id: obj._id.toString(),
            quantityAvailable: Number(obj.quantityAvailable),
            reorderLevel: Number(obj.reorderLevel)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /inventory/:id - Update item
router.put('/inventory/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        const currentItem = await InventoryItem.findById(id);
        if (!currentItem) return res.status(404).json({ message: 'Item not found' });

        // Ensure numbers are numbers
        if (updates.quantityAvailable !== undefined) updates.quantityAvailable = Number(updates.quantityAvailable);
        if (updates.reorderLevel !== undefined) updates.reorderLevel = Number(updates.reorderLevel);

        // Recalculate status
        const newQty = updates.quantityAvailable !== undefined ? updates.quantityAvailable : currentItem.quantityAvailable;
        const newLevel = updates.reorderLevel !== undefined ? updates.reorderLevel : currentItem.reorderLevel;
        updates.stockStatus = calculateStatus(newQty, newLevel);

        const updatedItem = await InventoryItem.findByIdAndUpdate(id, updates, { new: true });
        const obj = updatedItem.toObject();
        res.json({
            ...obj,
            id: obj._id.toString(),
            quantityAvailable: Number(obj.quantityAvailable),
            reorderLevel: Number(obj.reorderLevel)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /inventory/:id - Delete item
router.delete('/inventory/:id', protect, async (req, res) => {
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
