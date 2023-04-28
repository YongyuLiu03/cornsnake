import React, { useState } from 'react';

const LoginForm = ({ onFormSubmit }) => {
    const [formMode, setFormMode] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
  
      if (formMode === 'register' && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      const success = await onFormSubmit({ formMode, username, password });
  
      if (!success) {
        setError('Login/Register failed');
      }
    };
  
    const switchFormMode = () => {
      setFormMode(formMode === 'login' ? 'register' : 'login');
      setError('');
    };

  return (
    <form onSubmit={handleSubmit} className='login-form'>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="username"
          id="username"
          name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {formMode === 'register' && (
        <div>
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            name='confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}
      <div>
        <button type="submit">
          {formMode === 'login' ? 'Login' : 'Register'}
        </button>
      </div>
      <div>
        <button onClick={switchFormMode}>
          {formMode === 'login'
            ? 'Need an account? Register'
            : 'Already have an account? Login'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
