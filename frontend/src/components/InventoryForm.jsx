import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryForm = ({ initialData, onSubmit, title, buttonText }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        quantityAvailable: '',
        unit: '',
        reorderLevel: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.itemName || !formData.category) {
            alert('Please fill in required fields');
            return;
        }

        // Parse numbers
        const submission = {
            ...formData,
            quantityAvailable: parseFloat(formData.quantityAvailable) || 0,
            reorderLevel: parseFloat(formData.reorderLevel) || 0
        };

        onSubmit(submission);
    };

    return (
        <div className="form-card">
            <div className="form-header">
                <h2>{title}</h2>
            </div>
            <form onSubmit={handleSubmit} className="inventory-form">
                <div className="form-group">
                    <label>Item Name *</label>
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        placeholder="e.g., Tomato Sauce"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Pantry">Pantry</option>
                            <option value="Refrigerated">Refrigerated</option>
                            <option value="Frozen">Frozen</option>
                            <option value="Produce">Produce</option>
                            <option value="Supplies">Supplies</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Unit *</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="kg, liters, cans..."
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Quantity *</label>
                        <input
                            type="number"
                            name="quantityAvailable"
                            value={formData.quantityAvailable}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Reorder Level *</label>
                        <input
                            type="number"
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InventoryForm;
