import { useEffect, useState } from 'react';
import Login from './components/login.jsx';
import Register from './components/Register';

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [workouts, setWorkouts] = useState([]);
  const [title, setTitle] = useState('');
  const [reps, setReps] = useState('');
  const [load, setLoad] = useState('');
  const [editLoad, setEditLoad] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editReps, setEditReps] = useState('');
  const [editTitle, setEditTitle] = useState('');


  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:4000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (response.ok) setWorkouts(data);
    };

    fetchWorkouts();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { title, reps: Number(reps), load: Number(load) };

    const response = await fetch('http://localhost:4000/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(workout)
    });

    const data = await response.json();
    if (response.ok) {
      setWorkouts([data, ...workouts]);
      setTitle('');
      setReps('');
      setLoad('');
    }
  };

  const handleUpdate = async (id) => {
  const response = await fetch(
    `http://localhost:4000/api/workouts/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title: editTitle,
        reps: Number(editReps),
        load: Number(editLoad)
      })
    }
  );

  const updatedWorkout = await response.json();

  if (response.ok) {
    setWorkouts(
      workouts.map(w =>
        w._id === id ? updatedWorkout : w
      )
    );
    setEditingId(null);
  }
};

  const handleDelete = async (id) => {
    if (!confirm('Weet je het zeker?')) return;

    const response = await fetch(
      `http://localhost:4000/api/workouts/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.ok) {
      setWorkouts(workouts.filter(w => w._id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setWorkouts([]);
  };

  return (
    <div className="min-h-screen bg-black flex justify-center p-6 text-gray-200">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl shadow-xl shadow-purple-900/30 p-6">

        {!token ? (
          <div className="space-y-4">
            {showRegister ? (
              <>
                <Register setToken={setToken} />
                <p className="text-center text-sm text-gray-400">
                  Al een account?
                  <button
                    className="ml-2 text-purple-400 hover:text-purple-300 hover:underline"
                    onClick={() => setShowRegister(false)}
                  >
                    Inloggen
                  </button>
                </p>
              </>
            ) : (
              <>
                <Login setToken={setToken} />
                <p className="text-center text-sm text-gray-400">
                  Nog geen account?
                  <button
                    className="ml-2 text-purple-400 hover:text-purple-300 hover:underline"
                    onClick={() => setShowRegister(true)}
                  >
                    Registreren
                  </button>
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-purple-400">
                🏋️ Workouts
              </h1>
              <button
                onClick={handleLogout}
                className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                Uitloggen
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-3 mb-6"
            >
              <input
                type="text"
                placeholder="Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Load (kg)"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-semibold"
              >
                Toevoegen
              </button>
            </form>

            {workouts.length === 0 ? (
              <p className="text-gray-500 text-center">
                Geen workouts gevonden
              </p>
            ) : (
              <div className="space-y-4">
                {workouts.map(workout => (
                  <div
                    key={workout._id}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                    {editingId === workout._id ? (
  <div className="space-y-2">
    <input
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
      className="bg-zinc-700 p-1 rounded"
    />
    <input
      type="number"
      value={editReps}
      onChange={(e) => setEditReps(e.target.value)}
      className="bg-zinc-700 p-1 rounded"
    />
    <input
      type="number"
      value={editLoad}
      onChange={(e) => setEditLoad(e.target.value)}
      className="bg-zinc-700 p-1 rounded"
    />
    <button
      onClick={() => handleUpdate(workout._id)}
      className="text-green-400"
    >
      Opslaan
    </button>
  </div>
) : (
  <>
    <h3 className="font-semibold text-purple-300">
      {workout.title}
    </h3>
    <p className="text-sm text-gray-400">
      Reps: {workout.reps} · Load: {workout.load} kg
    </p>
  </>
)}

                    </div>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="text-red-400 hover:text-red-300 hover:underline"
                    >
                      Verwijderen
                    </button>
                    <button
  onClick={() => {
    setEditingId(workout._id);
    setEditTitle(workout.title);
    setEditReps(workout.reps);
    setEditLoad(workout.load);
  }}
  className="text-purple-400 hover:underline"
>
  Bewerken
</button> 

                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
