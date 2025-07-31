import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  userInfo: {
    userType: {
      type: String,
      enum: ['student', 'teacher', 'organization'],
      required: true
    },
    name: String,
    department: String,
    roll: String,
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Reservation', reservationSchema);
