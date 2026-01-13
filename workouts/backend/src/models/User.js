import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

// Dit gebeurt automatisch VOOR het opslaan
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    // Hash het wachtwoord
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Functie om wachtwoorden te vergelijken
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;