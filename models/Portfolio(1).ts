import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this project.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please specify the category.'],
  },
  client: {
    type: String,
    required: [true, 'Please specify the client name.'],
  },
  liveUrl: {
    type: String,
  },
  year: {
    type: String,
    default: new Date().getFullYear().toString(),
  },
  description: {
    type: String,
    required: [true, 'Please provide a short description.'],
  },
  challenge: {
    type: String,
    required: [true, 'Please describe the challenge.'],
  },
  solution: {
    type: String,
    required: [true, 'Please describe the solution.'],
  },
  results: [
    {
      label: String,
      value: String,
    }
  ],
  images: [String], // Array of image URLs
  size: {
    type: String,
    enum: ['normal', 'large', 'tall'],
    default: 'normal',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
