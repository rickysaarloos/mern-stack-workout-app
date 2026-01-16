import { useState } from 'react';

function Register({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Automatisch inloggen na registreren
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registreren</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Wachtwoord (min 6 tekens)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button>Registreren</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default Register;