var express = require('express');
var router = express.Router();
let { checkLogin } = require('../utils/authHandler.js');
let cartController = require('../controllers/carts');

// Middleware to find or create a cart and clean up invalid items
async function getOrCreateCart(req, res, next) {
    try {
        let userId = req.userId;
        let cart = await cartController.GetOrCreateCartByUser(userId);

        req.cart = cart;
        next();
    } catch (error) {
        next(error);
    }
}

// Handler logic for adding/updating items in the cart
const upsertCartItem = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        const cart = req.cart;

        if (!product || !quantity) {
            return res.status(400).send({ message: 'Product ID and quantity are required.' });
        }

        const populatedCart = await cartController.UpsertCartItem(cart, {
            product,
            quantity,
        });
        res.send(populatedCart);
    } catch (error) {
        next(error);
    }
};

router.get('/', checkLogin, getOrCreateCart, async function (req, res, next) {
    try {
        const populatedCart = await cartController.GetPopulatedCart(req.cart);

        res.send(populatedCart);
    } catch (error) {
        next(error);
    }
});

router.post('/', checkLogin, getOrCreateCart, upsertCartItem);
router.put('/', checkLogin, getOrCreateCart, upsertCartItem);

router.delete('/:productId', checkLogin, getOrCreateCart, async function (req, res, next) {
    try {
        const { productId } = req.params;
        const populatedCart = await cartController.RemoveCartItem(req.cart, productId);
        res.send(populatedCart);
    } catch (error) {
        next(error);
    }
});

router.delete('/', checkLogin, getOrCreateCart, async function (req, res, next) {
    try {
        const cart = await cartController.ClearCart(req.cart);
        res.send(cart);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
