import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Budget from './Budget';
import Transactions from './Transactions';
import '../styles/global.css';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">BRICS Banking</div>
        <div className="nav-links">
          <Link to="/budget" className="nav-link">Budget</Link>
          <Link to="/transactions" className="nav-link">Transactions</Link>
          <button onClick={handleLogout} className="auth-button logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, {user?.userName || 'User'}!</h1>
        </div>

        <div className="dashboard-widgets">
          <div className="widget">
            <Budget />
          </div>

          <div className="widget">
            <Transactions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;