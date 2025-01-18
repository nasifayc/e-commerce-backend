import mongoose from "mongoose";

const productCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory", // Self-referencing for subcategories
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

export default ProductCategory;
