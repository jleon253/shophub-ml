import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { useApp } from '../../context/AppContext/AppContext';
import Header from '../../components/Header/Header';

const LoginPage = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('name');

    if (username) {
      const welcomeElement = document.getElementById('welcome');
      if (welcomeElement) {
        welcomeElement.innerHTML = `Welcome back, ${username}!`;
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.trim() === '') {
      setError('Password is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('session', JSON.stringify({ email, password, id: data.user.id, name: data.user.name }));
        setUser(data.user);
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div>
      <Header />
      <main className="container">
        <div className="login-container">
          <h1 className="mb-3">Login to ShopHub</h1>

          <div id="welcome" className="mb-3 text-primary" aria-live="polite"></div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                aria-required="true"
              />
            </div>

            {error && <p role="alert" className="error-message">{error}</p>}
            {success && <p role="status" className="success-message">{success}</p>}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Login
            </button>
          </form>

          <aside className="mt-3 text-sm text-muted">
            <p>Test credentials:</p>
            <p>Email: john.doe@example.com</p>
            <p>Password: M3L1@T3st</p>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;

