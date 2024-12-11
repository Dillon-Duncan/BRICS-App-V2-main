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
          <label>
            Username:
            <input 
              type="text" 
              name="userName" 
              value={form.userName}
              onChange={handleChange} 
              required
            />
          </label>

          {!isEmployee && (
            <label>
              Account Number:
              <input 
                type="text" 
                name="accNumber" 
                value={form.accNumber}
                onChange={handleChange} 
                required
              />
            </label>
          )}

          <label>
            Password:
            <input 
              type="password" 
              name="password" 
              value={form.password}
              onChange={handleChange} 
              required
            />
          </label>

          <div className="auth-footer">
            <label>
              <input type="checkbox" onChange={handleEmployeeToggle} /> Employee Login
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">{isEmployee ? 'Login as Employee' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;