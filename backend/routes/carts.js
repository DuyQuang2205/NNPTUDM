var express = require('express');
var router = express.Router();
let { checkLogin } = require('../utils/authHandler.js');
let cartModel = require('../schemas/cart');

// Middleware to find or create a cart and clean up invalid items
async function getOrCreateCart(req, res, next) {
    try {
        let userId = req.userId;
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = await cartModel.create({ user: userId, items: [] });
        }

        // Cleanup: Filter out items that are null or missing a product field.
        const originalItemCount = cart.items.length;
        cart.items = cart.items.filter(item => item && item.product);
        if (cart.items.length !== originalItemCount) {
            // If items were removed, save the cleaned cart.
            await cart.save();
        }

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

        const index = cart.items.findIndex(
            (e) => e.product && e.product.toString() === product
        );

        if (index > -1) {
            // Product exists in cart, update quantity
            cart.items[index].quantity = quantity;
        } else {
            // Product does not exist, add it
            cart.items.push({ product: product, quantity: quantity });
        }

        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.send(populatedCart);
    } catch (error) {
        next(error);
    }
};

router.get('/', checkLogin, getOrCreateCart, async function (req, res, next) {
    try {
        const populatedCart = await req.cart.populate('items.product');
        
        // Filter out items where the product is soft-deleted or doesn't exist
        const validItems = populatedCart.items.filter(item => item.product && !item.product.isDeleted);
        
        // If the number of items changed, it means some were invalid and we should clean them from the database
        if (validItems.length < populatedCart.items.length) {
            populatedCart.items = validItems;
            await populatedCart.save(); // Save the cleaned cart
        }

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
        const cart = req.cart;

        cart.items.pull({ product: productId });
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.send(populatedCart);
    } catch (error) {
        next(error);
    }
});

router.delete('/', checkLogin, getOrCreateCart, async function (req, res, next) {
    try {
        const cart = req.cart;
        cart.items = [];
        await cart.save();
        res.send(cart);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
