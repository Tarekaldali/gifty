import { Router } from "express";
import { verifyToken, adminOnly } from "../middleware/auth.js";
import {
  getReadyBoxes,
  getAllReadyBoxes,
  getReadyBox,
  createReadyBox,
  updateReadyBox,
  deleteReadyBox,
} from "../controllers/readyBoxController.js";

const router = Router();

router.get("/",        getReadyBoxes);                          // public
router.get("/all",     verifyToken, adminOnly, getAllReadyBoxes); // admin
router.get("/:id",     getReadyBox);                             // public
router.post("/",       verifyToken, adminOnly, createReadyBox);  // admin
router.put("/:id",     verifyToken, adminOnly, updateReadyBox);  // admin
router.delete("/:id",  verifyToken, adminOnly, deleteReadyBox);  // admin

export default router;
