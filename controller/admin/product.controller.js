import Product from "../../model/product.model.js";
import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import { request } from "http";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { id } = req.user;

    const products = await Product.find({ created_by: id }).populate(
      "category",
      "name"
    );

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error("error", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

// create new product
export const createProduct = async (req, res) => {
  const images = req.files?.map((file) => file.path);

  try {
    const productData = { ...req.body, images, created_by: req.user.id };
    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (images && images.length > 0) {
      images.forEach((image) => {
        fs.unlink(image, (err) => {
          if (err) console.error(`Failed to delete image: ${image}`, err);
        });
      });
    }

    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const images = req.files?.map((file) => file.path);
  const updatedData = { ...req.body, ...(images.length && { images }) };

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // If new images are provided, delete the old ones
    if (images && product.images.length > 0) {
      product.images.forEach((image) => {
        fs.unlink(image, (err) => {
          if (err) console.error(`Failed to delete image: ${image}`, err);
        });
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    if (images && images.length > 0) {
      images.forEach((image) => {
        fs.unlink(image, (err) => {
          if (err) console.error(`Failed to delete image: ${image}`, err);
        });
      });
    }

    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete images associated with the product
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        fs.unlink(image, (err) => {
          if (err) console.error(`Failed to delete image: ${image}`, err);
        });
      });
    }

    await Product.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.find({ category: categoryId });

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  const { query, category, brand, name } = req.query;

  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = { $regex: brand, $options: "i" };
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve search results",
      error: error.message,
    });
  }
};
