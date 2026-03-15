import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  type: { type: String, required: true }, // e.g. SaaS, Web App
  link: { type: String, required: true },
  actionType: { type: String, enum: ['visit', 'download'], default: 'visit' },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
