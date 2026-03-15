import mongoose from 'mongoose';

const ThemeSchema = new mongoose.Schema({
  primaryColor: {
    type: String,
    required: true,
    default: "#f6d36b" // brand-yellow
  },
  primaryHoverColor: {
    type: String,
    required: true,
    default: "#eac45a" // brand-yellow-hover
  },
  secondaryColor: {
    type: String,
    required: true,
    default: "#000000" // Not currently used extensively as a var, but good to have
  },
  backgroundColor: {
    type: String,
    required: true,
    default: "#ffffff"
  },
  foregroundColor: {
    type: String,
    required: true,
    default: "#000000"
  }
}, {
  timestamps: true,
});

export default mongoose.models.Theme || mongoose.model('Theme', ThemeSchema);
