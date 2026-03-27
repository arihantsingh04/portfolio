import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import './Admin.css';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase client not initialized. Check .env variables.");
      return;
    }
    
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    if (adminEmail && email !== adminEmail) {
      setError("Unauthorized email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-lock-icon">
            <Lock size={28} />
          </div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage portfolio content</p>
        </div>

        {error && (
          <div className="admin-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="admin-submit-btn"
            disabled={loading}
            data-cursor="pointer"
          >
            {loading ? <Loader2 size={20} className="spinner" /> : 'Log In'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <button onClick={() => navigate('/')} className="back-link" data-cursor="pointer">
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};
