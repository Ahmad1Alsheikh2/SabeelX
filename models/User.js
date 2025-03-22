const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['USER', 'MENTOR'],
        default: 'USER',
        required: true
    },
    image: {
        type: String
    },
    bio: {
        type: String
    },
    skills: [{
        type: String
    }],
    expertise: [{
        type: String
    }],
    country: {
        type: String
    },
    experience: {
        type: Number
    },
    hourlyRate: {
        type: Number
    },
    title: {
        type: String
    },
    company: {
        type: String
    },
    availability: {
        type: Number
    },
    emailVerified: {
        type: Date
    },
    isProfileComplete: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema); 