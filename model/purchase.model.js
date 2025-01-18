import mongoose from "mongoose";

const purchaseSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product reference is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: 1,
        },
        priceAtPurchase: {
          type: Number,
          required: [true, "Product price at purchase time is required"],
          min: 0,
        },
        totalPrice: {
          type: Number, // Calculated as priceAtPurchase * quantity
          required: true,
        },
        selectedVariants: [
          {
            name: String, // Example: 'Size', 'Color'
            value: String, // Example: 'Small', 'Red'
          },
        ],
      },
    ],
    totalAmount: {
      type: Number, // Sum of all `products.totalPrice`
      required: true,
      min: 0,
    },
    discount: {
      type: Number, // Discount percentage applied to the total amount
      default: 0,
      min: 0,
      max: 100,
    },
    finalAmount: {
      type: Number, // Total amount after applying discount
      required: true,
      min: 0,
    },
    txRef: {
      type: String,
      required: [true, "txRef is required"],
      unique: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    checkout_url: String,
    paymentMethod: {
      type: String,
      enum: ["Santim_Pay", "Chapa"], // Include supported payment methods
      required: [true, "Payment method is required"],
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Full name is required for shipping"],
        trim: true,
      },
      addressLine1: {
        type: String,
        required: [true, "Address line 1 is required"],
        trim: true,
      },
      addressLine2: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
    },
    shippingCost: {
      type: Number,
      required: [true, "Shipping cost is required"],
      min: 0,
    },
    trackingNumber: {
      type: String,
      default: null,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;
