let mongoose = require('mongoose');

let paymentSchema = mongoose.Schema({
    method: {
        type: String,
        required: true,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cod']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {
    timestamps: true
});

module.exports = new mongoose.model('payment', paymentSchema);
