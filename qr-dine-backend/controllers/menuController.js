import asyncHandler from "express-async-handler";
import MenuItem from "../models/MenuItem.js";

const getBaseUrl = (req) => {
  return process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
};

const computeImageUrl = (image, baseUrl) => {
  if (!image) return "";
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${baseUrl}/uploads/${image}`;
};

// Add menu item
export const addMenuItem = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ message: "Name, category, and price are required" });
  }

  const image = req.file ? req.file.filename : ""; // store filename only
  const newItem = new MenuItem({ name, category, price, description, image });

  const savedItem = await newItem.save();
  const baseUrl = getBaseUrl(req);
  res.status(201).json({
    ...savedItem.toObject(),
    imageUrl: computeImageUrl(savedItem.image, baseUrl)
  });
});

// Get all menu items
export const getMenuItems = asyncHandler(async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const items = await MenuItem.find();
  const itemsWithUrl = items.map(item => ({
    ...item.toObject(),
    imageUrl: computeImageUrl(item.image, baseUrl)
  }));
  res.json(itemsWithUrl);
});

// Delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Menu item not found" });
  await item.deleteOne();
  res.json({ message: "Menu item deleted successfully" });
});

// Update menu item
export const updateMenuItem = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Menu item not found" });

  item.name = name || item.name;
  item.category = category || item.category;
  item.price = price || item.price;
  item.description = description || item.description;
  if (req.file) item.image = req.file.filename;

  const updated = await item.save();
  const baseUrl = getBaseUrl(req);
  res.json({
    ...updated.toObject(),
    imageUrl: computeImageUrl(updated.image, baseUrl)
  });
});
