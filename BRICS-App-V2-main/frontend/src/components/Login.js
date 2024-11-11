import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { loginUserAPI, loginEmployeeAPI } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/global.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isEmployee, setIsEmployee] = useState(false);
  const [form, setForm] = useState({
    userName: '',
    accNumber: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEmployeeToggle = (e) => {
    setIsEmployee(e.target.checked);
    if (e.target.checked) {
      setForm(prev => ({
        ...prev,
        accNumber: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const credentials = {
        username: form.userName,
        password: form.password,
        ...(isEmployee ? {} : { accNumber: form.accNumber })
      };
  
      const loginResponse = await login(credentials, isEmployee);
  
      if (loginResponse.success) {
        navigate(isEmployee ? '/employee-dashboard' : '/user-dashboard');
      } else {
        setError(loginResponse.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="form-title">{isEmployee ? 'Employee Login' : 'User Login'}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Username"
              required
              autoComplete="username"
              className="input-field"
            />
          </div>

          {!isEmployee && (
            <div className="form-group">
              <input
                type="text"
                name="accNumber"
                value={form.accNumber}
                onChange={handleChange}
                placeholder="Account Number"
                required={!isEmployee}
                autoComplete="off"
                className="input-field"
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isEmployee ? "Employee Password" : "Password"}
              required
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button">
            Login
          </button>

          {!isEmployee && (
            <div className="auth-link">
              <p>Don't have an account? <Link to="/register">Register here</Link></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
