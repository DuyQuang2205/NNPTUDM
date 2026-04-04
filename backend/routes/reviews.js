const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviews");
const { checkLogin, checkRole } = require("../utils/authHandler");
const { uploadImage } = require("../utils/uploadHandler");
const { body, validationResult } = require("express-validator");

// Middleware validation
const validateReview = [
  body("product").notEmpty().withMessage("Product ID là bắt buộc"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Đánh giá phải từ 1 đến 5"),
  body("title")
    .notEmpty()
    .withMessage("Tiêu đề là bắt buộc")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Tiêu đề ít nhất 5 ký tự"),
  body("comment")
    .notEmpty()
    .withMessage("Bình luận là bắt buộc")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Bình luận ít nhất 10 ký tự"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET all reviews for product (public)
router.get("/product/:productId", async (req, res, next) => {
  try {
    const reviews = await reviewController.GetReviewsByProduct(
      req.params.productId,
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all reviews (ADMIN only - with all statuses)
router.get(
  "/admin/all",
  checkLogin,
  checkRole("ADMIN"),
  async (req, res, next) => {
    try {
      const reviews = await reviewController.GetAllReviews({}, true);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

// GET my reviews (USER - logged in)
router.get("/my-reviews", checkLogin, async (req, res, next) => {
  try {
    const reviews = await reviewController.GetReviewsByUser(req.userId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET review by ID (public)
router.get("/:id", async (req, res, next) => {
  try {
    const review = await reviewController.GetReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tìm thấy" });
    }
    res.json(review);
  } catch (error) {
    res.status(404).json({ message: "Đánh giá không tìm thấy" });
  }
});

// CREATE review with images (USER - logged in)
router.post(
  "/",
  checkLogin,
  uploadImage.array("images", 5),
  validateReview,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { product, rating, title, comment } = req.body;
      const images = req.files ? req.files.map((f) => f.path) : [];

      const newReview = await reviewController.CreateReview(
        product,
        req.userId,
        rating,
        title,
        comment,
        images,
      );
      res.status(201).json(newReview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// UPDATE review (USER - own review only)
router.put(
  "/:id",
  checkLogin,
  uploadImage.array("images", 5),
  validateReview,
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const review = await reviewController.GetReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Đánh giá không tìm thấy" });
      }

      // Check if user is owner or admin
      if (
        review.user._id.toString() !== req.userId &&
        req.userRole !== "ADMIN"
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền cập nhật đánh giá này" });
      }

      const updateData = { ...req.body };
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((f) => f.path);
      }

      const updatedReview = await reviewController.UpdateReview(
        req.params.id,
        updateData,
      );
      res.json(updatedReview);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// APPROVE review (ADMIN only)
router.patch(
  "/:id/approve",
  checkLogin,
  checkRole("ADMIN"),
  async (req, res, next) => {
    try {
      const approvedReview = await reviewController.ApproveReview(
        req.params.id,
      );
      if (!approvedReview) {
        return res.status(404).json({ message: "Đánh giá không tìm thấy" });
      }
      res.json({ message: "Đánh giá đã được phê duyệt", data: approvedReview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// REJECT review (ADMIN only)
router.patch(
  "/:id/reject",
  checkLogin,
  checkRole("ADMIN"),
  async (req, res, next) => {
    try {
      const rejectedReview = await reviewController.RejectReview(req.params.id);
      if (!rejectedReview) {
        return res.status(404).json({ message: "Đánh giá không tìm thấy" });
      }
      res.json({ message: "Đánh giá đã bị từ chối", data: rejectedReview });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// MARK as helpful (USER - logged in)
router.patch("/:id/helpful", checkLogin, async (req, res, next) => {
  try {
    const review = await reviewController.MarkHelpful(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tìm thấy" });
    }
    res.json({
      message: "Đánh giá được đánh dấu hữu ích",
      helpful: review.helpful,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE review (USER - own review or ADMIN)
router.delete("/:id", checkLogin, async (req, res, next) => {
  try {
    const review = await reviewController.GetReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tìm thấy" });
    }

    // Check if user is owner or admin
    if (review.user._id.toString() !== req.userId && req.userRole !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa đánh giá này" });
    }

    const deletedReview = await reviewController.DeleteReview(req.params.id);
    res.json({ message: "Đánh giá đã được xóa", data: deletedReview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
