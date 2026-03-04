import express from "express";
import { getTables, addTable, getTableByNumber, generateAllQRCodes, deleteTable } from "../controllers/tableController.js";

const router = express.Router();

router.get("/", getTables);
router.post("/generate-qr", generateAllQRCodes); // Generate QR codes for all tables
router.get("/:tableNumber", getTableByNumber);  // Add this line
router.post("/", addTable);
router.delete("/:id", deleteTable);

export default router;