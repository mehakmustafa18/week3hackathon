import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPage.css';

const AuthPage = () => {
  const location  = useLocation();
  const isLogin   = location.pathname === '/login';
  const navigate  = useNavigate();
  const { login, signup } = useAuth();

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await login(form.email, form.password);
      } else {
        user = await signup(form.name, form.email, form.password);
      }
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      // Redirect based on role
      if (user.role === 'superadmin' || user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C9 1 3 5 3 10.5C3 13.5 5.7 16 9 16C12.3 16 15 13.5 15 10.5C15 5 9 1 9 1Z" fill="currentColor"/>
          </svg>
          <span>Brand Name</span>
        </div>

        <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to your account' : 'Join us and start your tea journey'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text" name="name"
                value={form.name} onChange={handleChange}
                placeholder="Your name"
                className={errors.name ? 'auth-input--error' : ''}
              />
              {errors.name && <span className="auth-error">{errors.name}</span>}
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>
            <input
              type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'auth-input--error' : ''}
            />
            {errors.email && <span className="auth-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'auth-input--error' : ''}
            />
            {errors.password && <span className="auth-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>Don't have an account? <Link to="/signup">Sign up</Link></>
          ) : (
            <>Already have an account? <Link to="/login">Sign in</Link></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
