import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInventoryContext } from '../context/InventoryContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const { stats } = useInventoryContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/welcome');
    };

    return (
        <div className="layout-shell">
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        <span className="brand-icon">📦</span>
                        <span className="brand-text">InvPro</span>
                    </div>
                    <ul className="nav-links">
                        <li>
                            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inventory" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                                All Stock
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inventory?filter=low" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Low Stock
                                {stats.lowStock > 0 && <span className="nav-counter warning">{stats.lowStock}</span>}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/inventory?filter=out" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                Out of Stock
                                {stats.outOfStock > 0 && <span className="nav-counter danger">{stats.outOfStock}</span>}
                            </NavLink>
                        </li>
                    </ul>

                    {user && (
                        <div className="user-menu">
                            <div className="user-info">
                                <span className="user-avatar">{user.name.charAt(0)}</span>
                                <span className="user-name">{user.name}</span>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <main className="main-content">
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
