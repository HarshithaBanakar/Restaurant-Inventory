import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventoryContext } from '../context/InventoryContext';
import InventoryForm from '../components/InventoryForm';

const InventoryFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { inventory, addItem, updateItem } = useInventoryContext();

    const isEditMode = Boolean(id);

    // Find item if editing
    const existingItem = useMemo(() => {
        if (!isEditMode) return null;
        return inventory.find(i => i.id === id);
    }, [id, inventory, isEditMode]);

    // Handle missing item in edit mode
    if (isEditMode && !existingItem) {
        return (
            <div className="error-container">
                <h2>Item not found</h2>
                <button onClick={() => navigate('/inventory')} className="btn btn-primary">Back to List</button>
            </div>
        );
    }

    const handleSubmit = (data) => {
        if (isEditMode) {
            updateItem(id, data);
            navigate('/inventory'); // Or back to where they came from
        } else {
            addItem(data);
            navigate('/inventory');
        }
    };

    return (
        <div className="form-page">
            <InventoryForm
                initialData={existingItem}
                onSubmit={handleSubmit}
                title={isEditMode ? `Edit Item: ${existingItem.itemName}` : 'Add New Inventory Item'}
                buttonText={isEditMode ? 'Save Changes' : 'Add Item'}
            />
        </div>
    );
};

export default InventoryFormPage;
