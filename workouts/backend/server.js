import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import workoutRoutes from './src/routes/workoutRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS toestaan voor frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Middleware
app.use(express.json());



// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API draait!',
    endpoints: {
      workouts: '/api/workouts'
    }
  });
});

// Connect MongoDB (non-blocking for dev)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Verbonden met MongoDB'))
  .catch(err => console.error('❌ MongoDB fout:', err.message));
  
  // Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);

// Start server ONCE
app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
