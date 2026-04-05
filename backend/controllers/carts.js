let cartModel = require("../schemas/cart");

async function cleanInvalidItems(cart) {
  const originalItemCount = cart.items.length;
  cart.items = cart.items.filter((item) => item && item.product);
  if (cart.items.length !== originalItemCount) {
    await cart.save();
  }
  return cart;
}

module.exports = {
  GetOrCreateCartByUser: async function (userId) {
    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await cartModel.create({ user: userId, items: [] });
    }
    return await cleanInvalidItems(cart);
  },

  GetPopulatedCart: async function (cart) {
    const populated = await cart.populate("items.product");
    const validItems = populated.items.filter(
      (item) => item.product && !item.product.isDeleted,
    );

    if (validItems.length < populated.items.length) {
      populated.items = validItems;
      await populated.save();
    }
    return populated;
  },

  UpsertCartItem: async function (cart, { product, quantity }) {
    const index = cart.items.findIndex(
      (e) => e.product && e.product.toString() === product,
    );

    if (index > -1) {
      cart.items[index].quantity = quantity;
    } else {
      cart.items.push({ product, quantity });
    }

    await cart.save();
    return await cart.populate("items.product");
  },

  RemoveCartItem: async function (cart, productId) {
    cart.items.pull({ product: productId });
    await cart.save();
    return await cart.populate("items.product");
  },

  ClearCart: async function (cart) {
    cart.items = [];
    await cart.save();
    return cart;
  },
};
