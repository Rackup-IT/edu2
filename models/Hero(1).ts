import mongoose from 'mongoose';

const HeroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  subtitle: {
    type: String,
    required: [true, 'Please provide a subtitle'],
  },
  buttonText: {
    type: String,
    required: [true, 'Please provide text for the primary button'],
  },
  buttonLink: {
    type: String,
    default: '/consultation',
  },
  secondaryButtonText: {
    type: String,
    default: 'Portfolio',
  },
  secondaryButtonLink: {
    type: String,
    default: '/portfolio',
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an illustration image'],
  },
  backgroundColor: {
    type: String,
    default: '#f6d36b', // Default brand yellow
  },
}, {
  timestamps: true,
});

// Helper to ensure we don't recompile the model
export default mongoose.models.Hero || mongoose.model('Hero', HeroSchema);
