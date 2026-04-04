const modelCategory = require('../schemas/categories');

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const newCategory = new modelCategory({
      name,
      description,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await modelCategory.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await modelCategory.findById(req.params.id);
    if (category && !category.isDeleted) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await modelCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await modelCategory.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (category) {
      res.status(200).json({ message: 'Category successfully deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
