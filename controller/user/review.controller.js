import Product from "../../model/product.model.js";
import Review from "../../model/review.model.js";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const userId = req.user.id;

    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const newReview = new Review({
      product,
      user: userId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: savedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .populate("likes", "name")
      .populate("dislikes", "name");

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: id, user: userId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// Like a review
export const likeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (!review.likes.includes(userId)) {
      review.likes.push(userId);
      review.dislikes = review.dislikes.filter(
        (user) => user.toString() !== userId
      );
    }

    await review.save();
    res
      .status(200)
      .json({ success: true, message: "Review liked successfully", review });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to like review",
      error: error.message,
    });
  }
};

// Dislike a review
export const dislikeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (!review.dislikes.includes(userId)) {
      review.dislikes.push(userId);
      review.likes = review.likes.filter((user) => user.toString() !== userId);
    }

    await review.save();
    res
      .status(200)
      .json({ success: true, message: "Review disliked successfully", review });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to dislike review",
      error: error.message,
    });
  }
};
