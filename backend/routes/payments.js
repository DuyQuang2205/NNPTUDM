var express = require('express');
var router = express.Router();
let paymentController = require('../controllers/payments');
let { checkLogin } = require('../utils/authHandler.js');

// GET all payments for the logged-in user
router.get('/', checkLogin, async (req, res) => {
    try {
        const payments = await paymentController.GetPaymentsByUser(req.userId);
        res.send(payments);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching payments', error });
    }
});

// GET a specific payment by ID
router.get('/:id', checkLogin, async (req, res) => {
    try {
        const payment = await paymentController.GetPaymentById(req.params.id, req.userId);
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
        const payment = await paymentController.CreatePayment(req.body, req.userId);
        res.status(201).send(payment);
    } catch (error) {
        res.status(400).send({ message: 'Error creating payment', error });
    }
});

// PUT to update a payment by ID
router.put('/:id', checkLogin, async (req, res) => {
    try {
        const payment = await paymentController.UpdatePayment(
            req.params.id,
            req.body,
            req.userId
        );

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
        const payment = await paymentController.DeletePayment(req.params.id, req.userId);
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }
        res.send({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting payment', error });
    }
});

module.exports = router;
