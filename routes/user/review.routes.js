import { Router } from "express";
import verifyToken from "../../middleware/verifyToken.js";
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  likeReview,
  dislikeReview,
} from "../../controller/user/review.controller.js";

import {
  validateReview,
  handleValidationErrors,
} from "../../middleware/expressValidator.js";

const router = Router();

// all reviews
router.get("/get-reveiws/:id", verifyToken, getProductReviews);

// create a review
router.post(
  "/create-review",
  verifyToken,
  validateReview,
  handleValidationErrors,
  createReview
);

// update a review
router.put(
  "/update-review/:id",
  verifyToken,
  validateReview,
  handleValidationErrors,
  updateReview
);

// delete a review

router.delete("/delete-review/:id", verifyToken, deleteReview);

// like a review

router.post("/like-review/:id", verifyToken, likeReview);

// dislike a review
router.post("/dislike-review/:id", verifyToken, dislikeReview);

export default router;
