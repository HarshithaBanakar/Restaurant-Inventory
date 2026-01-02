import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="layout-shell">
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="nav-brand">
                        🍽️ RestoManager
                    </div>
                    <ul className="nav-links">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/inventory"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                                end // Exact match for list root
                            >
                                Inventory List
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/inventory/add"
                                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            >
                                Add Item
                            </NavLink>
                        </li>
                    </ul>
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
