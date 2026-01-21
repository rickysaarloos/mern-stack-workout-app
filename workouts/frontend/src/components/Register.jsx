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
    <form
      onSubmit={handleRegister}
      className="bg-zinc-900 p-6 rounded-2xl shadow-xl shadow-purple-900/30 space-y-4"
    >
      <h2 className="text-2xl font-bold text-purple-400 text-center">
        Registreren
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <input
        type="password"
        placeholder="Wachtwoord (min 6 tekens)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold
                   py-2 rounded-lg transition"
      >
        Registreren
      </button>

      {error && (
        <p className="text-red-400 text-sm text-center">
          {error}
        </p>
      )}
    </form>
  );
}

export default Register;
