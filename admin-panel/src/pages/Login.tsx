import React from 'react';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      <LoginForm />
    </div>
  );
};

export default Login;