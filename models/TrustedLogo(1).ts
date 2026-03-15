import mongoose from 'mongoose';

const TrustedLogoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  logo: {
    type: String,
    required: [true, 'Please provide a logo URL'],
  },
  position: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TrustedLogo || mongoose.model('TrustedLogo', TrustedLogoSchema);

