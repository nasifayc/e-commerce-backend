import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
    },
    images: [
      {
        type: String,
        required: [true, "At least one image is required"],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
    },
    variants: [
      {
        name: String, // Example: 'Size', 'Color'
        options: [
          {
            value: String, // Example: 'Small', 'Red'
            additionalPrice: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
    discount: {
      type: Number, // Discount in percentage
      min: 0,
      max: 100,
    },
    sku: {
      type: String, // Stock Keeping Unit
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
