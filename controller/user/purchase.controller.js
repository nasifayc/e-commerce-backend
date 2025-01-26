import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Correct the import statement
import Product from "../../model/product.model.js";
import Purchase from "../../model/purchase.model.js";

const config = {
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_AUTH}`,
  },
};

// Generate a unique transaction reference
const generateTxRef = () => {
  return uuidv4(); // Use the correct function
};

export const purchaseProducts = async (req, res) => {
  try {
    const {
      products,
      discount,
      paymentMethod,
      shippingAddress,
      shippingCost,
      notes,
    } = req.body;

    if (!["Santim_Pay", "Chapa"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Payment method not supported." });
    }

    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${item.product} not found.` });
      }

      totalAmount += product.price * item.quantity;
    }

    // final amount after discount
    const finalAmount = totalAmount - (totalAmount * (discount || 0)) / 100;
    const txRef = generateTxRef();

    const newPurchase = new Purchase({
      user: req.user.id,
      products: products.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
        totalPrice: item.quantity * item.priceAtPurchase,
        selectedVariants: item.selectedVariants || [],
      })),
      totalAmount,
      discount,
      finalAmount,
      txRef,
      paymentMethod,
      shippingAddress,
      shippingCost,
      notes,
      created_by: req.user.id,
    });

    await newPurchase.save();

    let checkout_url;
    if (paymentMethod == "Chapa") {
      const CHAPA_URL = process.env.CHAPA_URL;

      const chapaData = {
        amount: finalAmount,
        currency: "ETB",
        email: req.user.email,
        first_name: "Ato/wro",
        last_name: req.user.name,
        tx_ref: txRef,
        callback_url: process.env.CHAPA_CALLBACK_URL + txRef,
        return_url: `http://localhost:4003/api/purchase/verify-chapa-payment/${txRef}`,
      };

      const response = await axios.post(CHAPA_URL, chapaData, config);
      checkout_url = response.data?.data?.checkout_url;
      console.log(checkout_url);

      newPurchase.checkout_url = checkout_url;
      await purchasedBook.save();
      res.status(201).json({ success: true, savedPurchase });
    } else {
      return res
        .status(400)
        .json({ message: "Sorry!, Payment method is not available now." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyChapaPayment = async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await axios.get(
      "https://api.chapa.co/v1/transaction/verify/" + tx_ref,
      config
    );

    const { status } = response.data;

    if (status === "success") {
      const updatedPurchase = await Purchase.findOneAndUpdate(
        {
          txRef: tx_ref,
        },
        {
          paymentStatus: "Paid",
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.json({ success: true, updatedPurchase });
    }
  } catch (error) {
    console.log("Payment can't be verfied", error.message);
    res.status(400).json({ error: error.message });
  }
};
