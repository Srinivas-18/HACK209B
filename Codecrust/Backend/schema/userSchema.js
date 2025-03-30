const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfCodingQuestionsSolved: {
    type: Number,
    required: true,
    default: 0,
  },
  typeOfQuestionsSolved: {
    easy: {
      type: Number,
      default: 0, // Tracks how many easy questions were solved
    },
    medium: {
      type: Number,
      default: 0, // Tracks how many medium questions were solved
    },
    hard: {
      type: Number,
      default: 0, // Tracks how many hard questions were solved
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});


const User = mongoose.model('User', userSchema);

module.exports = User;
