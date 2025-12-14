import express from "express";
import {
  addSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet
} from "../controllers/sweetController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", adminOnly, addSweet);
router.get("/", getSweets);
router.get("/search", searchSweets);
router.put("/:id", adminOnly, updateSweet);
router.delete("/:id", adminOnly, deleteSweet);

router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", adminOnly, restockSweet);

export default router;
