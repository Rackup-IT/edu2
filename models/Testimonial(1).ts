import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, required: true }, // e.g. CEO
  image: { type: String, required: true }, // URL
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
