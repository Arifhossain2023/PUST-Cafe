import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['Free', 'Occupied', 'Reserved'], default: 'Free' },
  assignedTo: { type: String }, // optional waiter id
}, { timestamps: true });

const tableModel = mongoose.models.table || mongoose.model('table', tableSchema);
export default tableModel;
