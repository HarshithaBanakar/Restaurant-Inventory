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
        if (!formData.itemName || !formData.category) {
            alert('Please fill in required fields');
            return;
        }

        const submission = {
            ...formData,
            quantityAvailable: parseFloat(formData.quantityAvailable) || 0,
            reorderLevel: parseFloat(formData.reorderLevel) || 0
        };

        onSubmit(submission);
    };

    return (
        <div className="form-card animate-fade-in">
            <header className="form-header mb-8">
                <div className="form-icon-circle mb-4">
                    {initialData ? '📝' : '📦'}
                </div>
                <h2>{title}</h2>
                <p className="text-muted">Enter the details of the inventory item below.</p>
            </header>

            <form onSubmit={handleSubmit} className="inventory-form">
                <div className="form-group">
                    <label>Item Name</label>
                    <input
                        type="text"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleChange}
                        placeholder="e.g., Artisan Flour"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group field-50">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Baking">Baking</option>
                            <option value="Produce">Produce</option>
                            <option value="Meat">Meat</option>
                            <option value="Pantry">Pantry</option>
                            <option value="Beverages">Beverages</option>
                        </select>
                    </div>

                    <div className="form-group field-50">
                        <label>Unit</label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            placeholder="e.g., kg, unit"
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group field-50">
                        <label>Current Quantity</label>
                        <input
                            type="number"
                            name="quantityAvailable"
                            value={formData.quantityAvailable}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>

                    <div className="form-group field-50">
                        <label>Reorder Threshold</label>
                        <input
                            type="number"
                            name="reorderLevel"
                            value={formData.reorderLevel}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                            required
                        />
                    </div>
                </div>

                <div className="form-actions mt-8">
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
