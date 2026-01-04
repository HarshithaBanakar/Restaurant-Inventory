import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="logo-badge">Restaurant Inventory Pro</div>
                <h1>Effortless Kitchen Management</h1>
                <p className="subtitle">
                    Steamline your operations with our professional inventory tracking system.
                    Manage stock, monitor levels, and optimize your restaurant's performance.
                </p>
                <div className="cta-buttons">
                    <Link to="/login" className="btn btn-primary btn-lg">Login to Dashboard</Link>
                    <Link to="/signup" className="btn btn-outline btn-lg">Join as Staff</Link>
                </div>
            </div>
            <div className="welcome-features">
                <div className="feature-card">
                    <div className="feature-icon">📊</div>
                    <h3>Real-time Tracking</h3>
                    <p>Always know exactly what's in your pantry and cooler.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚠️</div>
                    <h3>Auto-Alerts</h3>
                    <p>Get notified when stock levels fall below your custom thresholds.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">👥</div>
                    <h3>Team Access</h3>
                    <p>Shared inventory data across all authenticated staff members.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
