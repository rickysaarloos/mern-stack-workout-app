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





  // READ - Haal alle workouts op
  useEffect(() => {
  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Niet ingelogd');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/workouts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts(data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


    fetchWorkouts();
  }, [token]);

  // CREATE - Nieuwe workout toevoegen
  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = { 
      title, 
      reps: Number(reps), 
      load: Number(load) 
    };

    try {
      const response = await fetch('http://localhost:4000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workout)
      });

      const data = await response.json();

      if (response.ok) {
        setWorkouts([data, ...workouts]); // Voeg toe aan lijst
        setTitle('');
        setReps('');
        setLoad('');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // DELETE - Workout verwijderen
  const handleDelete = async (id) => {
    if (!confirm('Weet je het zeker?')) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/workouts/${id}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        setWorkouts(workouts.filter(w => w._id !== id)); // Verwijder uit lijst
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    console.log('Uitgelogd');
    // Redirect naar login pagina of clear workouts
};

  return (
  <div className="App">
  {!token ? (
  <>
    {showRegister ? (
      <>
        <Register setToken={setToken} />
        <p>
          Al een account?
          <button onClick={() => setShowRegister(false)}>
            Inloggen
          </button>
        </p>
      </>
    ) : (
      <>
        <Login setToken={setToken} />
        <p>
          Nog geen account?
          <button onClick={() => setShowRegister(true)}>
            Registreren
          </button>
        </p>
      </>
    )}
  </>
) : (

      <>
        <h1>Workouts</h1>
         <button onClick={handleLogout}>
                Uitloggen
              </button>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
          <input
            type="number"
            placeholder="Load (kg)"
            value={load}
            onChange={(e) => setLoad(e.target.value)}
          />
          <button type="submit">Toevoegen</button>
        </form>

        {workouts.length === 0 ? (
          <p>Geen workouts gevonden</p>
        ) : (
          workouts.map(workout => (
            <div key={workout._id}>
              <h3>{workout.title}</h3>
              <p>Reps: {workout.reps}</p>
              <p>Load: {workout.load} kg</p>
              <button onClick={() => handleDelete(workout._id)}>
                Verwijderen
              </button>
             
            </div>
          ))
        )}
      </>
    )}
  </div>
);
}
export default App;