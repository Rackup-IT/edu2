import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  logoUrl: {
    type: String,
    default: "" // Fallback to hardcoded if empty
  },
  companyName: {
    type: String,
    required: true,
    default: "Forte Harbor Solution"
  },
  footerText: {
    type: String,
    default: "Leading Education Consultancy Service"
  }
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
