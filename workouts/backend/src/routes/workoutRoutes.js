import express from 'express';
import { 
  getAllWorkouts, 
  getWorkoutById, 
  createWorkout 
} from '../controllers/workoutController.js';

const router = express.Router();

// GET alle workouts
router.get('/', getAllWorkouts);

// GET één workout
router.get('/:id', getWorkoutById);

// POST nieuwe workout
router.post('/', createWorkout);

// PATCH workout (later)
// router.patch('/:id', updateWorkout);

// DELETE workout (later)
// router.delete('/:id', deleteWorkout);

export default router;
