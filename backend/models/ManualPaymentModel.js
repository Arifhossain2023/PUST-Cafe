import mongoose from 'mongoose';

const manualPaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  method: {
    type: String,
    enum: ['bkash', 'nagad', 'rocket'],
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  txnId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ManualPayment', manualPaymentSchema);
