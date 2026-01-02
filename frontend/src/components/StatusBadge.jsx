import React from 'react';

const StatusBadge = ({ status }) => {
    let colorClass = '';

    switch (status) {
        case 'Available':
            colorClass = 'badge-success';
            break;
        case 'Low Stock':
            colorClass = 'badge-warning';
            break;
        case 'Out of Stock':
            colorClass = 'badge-danger';
            break;
        default:
            colorClass = 'badge-default';
    }

    return (
        <span className={`status-badge ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
