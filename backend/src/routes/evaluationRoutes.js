import { Router } from "express";
import upload from "../middleware/uploadMiddleware.js";
import { validateGarment } from "../validators/garmentValidator.js";
import { evaluateGarment } from "../controllers/evaluationController.js";

const router = Router();

router.post(
  "/evaluate",
  upload.single("image"),
  validateGarment,
  evaluateGarment
);

export default router;
