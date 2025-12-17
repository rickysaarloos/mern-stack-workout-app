// GET alle workouts
const getWorkouts = (req, res) => {
  res.status(200).json({
    message: 'Alle workouts',
    data: []
  });
};

// GET één workout
const getWorkout = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID ontbreekt' });
  }

  // Fake voorbeeld: workout bestaat niet
  if (id !== '123') {
    return res.status(404).json({ error: 'Workout niet gevonden' });
  }

  res.status(200).json({
    message: `Workout ${id}`,
    id
  });
};

module.exports = {
  getWorkouts,
  getWorkout
};