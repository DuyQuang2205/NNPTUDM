var express = require('express');
var router = express.Router();
let paymentModel = require('../schemas/payments');
let { checkLogin } = require('../utils/authHandler.js');

// GET all payments for the logged-in user
router.get('/', checkLogin, async (req, res) => {
    try {
        const payments = await paymentModel.find({ user: req.userId }).populate('user', 'name email');
        res.send(payments);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching payments', error });
    }
});

// GET a specific payment by ID
router.get('/:id', checkLogin, async (req, res) => {
    try {
        const payment = await paymentModel.findOne({ _id: req.params.id, user: req.userId }).populate('user', 'name email');
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send(payment);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching payment', error });
    }
});

// POST a new payment
router.post('/', checkLogin, async (req, res) => {
    try {
        const payment = new paymentModel({
            ...req.body,
            user: req.userId
        });
        await payment.save();
        const populatedPayment = await payment.populate('user', 'name email');
        res.status(201).send(populatedPayment);
    } catch (error) {
        res.status(400).send({ message: 'Error creating payment', error });
    }
});

// PUT to update a payment by ID
router.put('/:id', checkLogin, async (req, res) => {
    try {
        const payment = await paymentModel.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email');

        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send(payment);
    } catch (error) {
        res.status(400).send({ message: 'Error updating payment', error });
    }
});

// DELETE a payment by ID
router.delete('/:id', checkLogin, async (req, res) => {
    try {
        const payment = await paymentModel.findOneAndDelete({ _id: req.params.id, user: req.userId });
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting payment', error });
    }
});

module.exports = router;
