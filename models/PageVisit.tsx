import mongoose from 'mongoose';

const pageVisitSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    index: true,
  },
  userAgent: {
    type: String,
    default: '',
  },
  ip: {
    type: String,
    default: '',
  },
  referrer: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

export default mongoose.models.PageVisit || mongoose.model('PageVisit', pageVisitSchema);
