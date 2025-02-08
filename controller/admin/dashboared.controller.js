import Admin from "../../model/admin.model.js";
import ProductCategory from "../../model/category.model.js";
import Product from "../../model/product.model.js";
import Purchase from "../../model/purchase.model.js";
import Review from "../../model/review.model.js";
import User from "../../model/user.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const users = await User.countDocuments({});
    const sellers = await Admin.countDocuments({});
    const products = await Product.countDocuments({});
    const categories = await ProductCategory.countDocuments({});
    const transactions = await Purchase.countDocuments({});
    const reviews = await Review.countDocuments({});

    res.status(200).json({
      users,
      sellers,
      products,
      categories,
      transactions,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve dashboard data",
      error: error.message,
    });
  }
};
