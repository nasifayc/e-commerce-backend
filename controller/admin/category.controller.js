import ProductCategory from "../../model/category.model";
import fs from "fs";
import { validationResult } from "express-validator";

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().populate("parentCategory");
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  const { name, description, parentCategory } = req.body;
  const image = req.file?.path;

  try {
    const category = await ProductCategory.create({
      name,
      description,
      image,
      parentCategory,
      created_by: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    if (image) {
      fs.unlink(image, (err) => {
        if (err) console.error("Failed to delete uploaded image", err);
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  const { name, description, parentCategory } = req.body;
  const image = req.file?.path;
  const { id } = req.params;

  try {
    const category = await ProductCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (image && category.image) {
      fs.unlink(category.image, (err) => {
        if (err) console.error("Failed to delete old image", err);
      });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;
    category.parentCategory = parentCategory || category.parentCategory;
    category.updated_by = req.user.id;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    if (image) {
      fs.unlink(image, (err) => {
        if (err) console.error("Failed to delete uploaded image", err);
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.image) {
      fs.unlink(category.image, (err) => {
        if (err) console.error("Failed to delete category image", err);
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

// Get a category by ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await ProductCategory.findById(id).populate(
      "parentCategory"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve category",
      error: error.message,
    });
  }
};
