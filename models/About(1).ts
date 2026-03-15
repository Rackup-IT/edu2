import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "We build software"
  },
  titleHighlight: {
    type: String,
    required: true,
    default: "that matters."
  },
  description: {
    type: String,
    required: true,
    default: "Forte Harbor Solution is a global software agency dedicated to helping businesses transform their digital presence."
  },
  heroImageUrl: {
    type: String,
    required: true,
    default: "https://placehold.co/1000x1000/neutral-900/ffffff?text=Our+Office"
  },
  stats: [{
    value: { type: String, required: true },
    label: { type: String, required: true }
  }],
  values: [{
    title: { type: String, required: true },
    description: { type: String, required: true }
  }],
  team: [{
    name: { type: String, required: true },
    role: { type: String, required: true },
    imageUrl: { type: String, required: true }
  }]
}, {
  timestamps: true,
});

export default mongoose.models.About || mongoose.model('About', AboutSchema);
