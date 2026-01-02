const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantityAvailable: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true
    },
    reorderLevel: {
        type: Number,
        required: true,
        min: 0
    },
    stockStatus: {
        type: String,
        enum: ['Available', 'Low Stock'],
        default: 'Available'
    }
});

module.exports = mongoose.model('InventoryItem', inventorySchema);
