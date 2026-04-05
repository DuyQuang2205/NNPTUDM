const slugify = require("slugify");
const modelProduct = require("../schemas/products");
const modelInventory = require("../schemas/inventories");
const modelColor = require("../schemas/colors");
const modelSize = require("../schemas/sizes");
const modelMaterial = require("../schemas/materials");
const reviewController = require("./reviews");

function toStockMeta(inventory) {
  const stock = inventory && !inventory.isDeleted ? Number(inventory.stock || 0) : 0;
  const isOutOfStock = !inventory || inventory.isDeleted || stock === 0;
  let stockStatus = "out_of_stock";
  let stockLabel = "Hết hàng";

  if (!isOutOfStock) {
    if (stock < 10) {
      stockStatus = "low_stock";
      stockLabel = `Sắp hết (còn ${stock})`;
    } else {
      stockStatus = "in_stock";
      stockLabel = `Còn hàng (${stock})`;
    }
  }

  return { stock, isOutOfStock, stockStatus, stockLabel };
}

function mergeProductWithInventory(productDoc, inventoryDoc) {
  const product = typeof productDoc.toObject === "function" ? productDoc.toObject() : productDoc;
  const inventory = inventoryDoc
    ? {
        _id: inventoryDoc._id,
        stock: Number(inventoryDoc.stock || 0),
        reserved: Number(inventoryDoc.reserved || 0),
        soldCount: Number(inventoryDoc.soldCount || 0),
        isDeleted: Boolean(inventoryDoc.isDeleted),
      }
    : null;

  return {
    ...product,
    inventory,
    ...toStockMeta(inventory),
  };
}

module.exports = {
  GetAllProducts: async function (filters = {}) {
    const query = { isDeleted: false, ...filters };
    const products = await modelProduct.find(query).sort({ createdAt: -1 });

    if (products.length === 0) {
      return [];
    }

    const productIds = products.map((p) => p._id);
    const inventories = await modelInventory.find({ product: { $in: productIds } });
    const inventoryMap = new Map(inventories.map((inv) => [String(inv.product), inv]));

    return products.map((p) => mergeProductWithInventory(p, inventoryMap.get(String(p._id))));
  },

  GetProductById: async function (id) {
    const product = await modelProduct.findOne({ _id: id, isDeleted: false });
    if (!product) return null;

    const inventory = await modelInventory.findOne({ product: id });
    return mergeProductWithInventory(product, inventory);
  },

  GetStoreOptions: async function () {
    const [colors, sizes, materials] = await Promise.all([
      modelColor.find({ isDeleted: false, isActive: true }).sort({ name: 1 }),
      modelSize.find({ isDeleted: false, isActive: true }).sort({ name: 1 }),
      modelMaterial.find({ isDeleted: false, isActive: true }).sort({ name: 1 }),
    ]);

    return { colors, sizes, materials };
  },

  GetProductDetail: async function (id) {
    const product = await modelProduct.findOne({ _id: id, isDeleted: false });
    if (!product) return null;

    const [inventory, options, reviews] = await Promise.all([
      modelInventory.findOne({ product: id }),
      this.GetStoreOptions(),
      reviewController.GetReviewsByProduct(id),
    ]);

    return {
      product: mergeProductWithInventory(product, inventory),
      options,
      reviews,
    };
  },

  CreateProduct: async function (payload) {
    const newObj = new modelProduct({
      sku: payload.sku,
      title: payload.title,
      slug: slugify(payload.title, {
        replacement: "-",
        remove: undefined,
        locale: "vi",
        trim: true,
      }),
      price: payload.price,
      description: payload.description,
      category: payload.category,
      images: payload.images,
    });

    const newProduct = await newObj.save();
    const newInventory = await new modelInventory({
      product: newProduct._id,
      stock: Number(payload.initialStock || 100),
    }).save();

    return mergeProductWithInventory(newProduct, newInventory);
  },

  UpdateProduct: async function (id, updateData) {
    const payload = { ...updateData };
    if (payload.title) {
      payload.slug = slugify(payload.title, {
        replacement: "-",
        remove: undefined,
        locale: "vi",
        trim: true,
      });
    }

    const updated = await modelProduct.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) return null;
    const inventory = await modelInventory.findOne({ product: updated._id });
    return mergeProductWithInventory(updated, inventory);
  },

  DeleteProduct: async function (id) {
    const deleted = await modelProduct.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!deleted) return null;

    await modelInventory.findOneAndUpdate(
      { product: id },
      { isDeleted: true },
      { new: true },
    );

    return deleted;
  },
};
