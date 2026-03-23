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

const resolveImageData = (req, baseUrl) => {
  if (!req.file) return { image: "", imageUrl: "" };

  // For Cloudinary storage, path is the URL; for local, filename is stored
  const imageUrl = req.file.path && req.file.path.startsWith('http')
    ? req.file.path
    : computeImageUrl(req.file.filename, baseUrl);

  return {
    image: req.file.filename || "",
    imageUrl,
  };
};

// Add menu item
export const addMenuItem = asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;
  if (!name || !category || !price) {
    return res.status(400).json({ message: "Name, category, and price are required" });
  }

  const baseUrl = getBaseUrl(req);
  const { image, imageUrl } = resolveImageData(req, baseUrl);

  const newItem = new MenuItem({ name, category, price, description, image, imageUrl });
  const savedItem = await newItem.save();

  res.status(201).json({ ...savedItem.toObject() });
});

// Get all menu items
export const getMenuItems = asyncHandler(async (req, res) => {
  const baseUrl = getBaseUrl(req);
  const items = await MenuItem.find();
  const itemsWithUrl = items.map(item => {
    const existingUrl = item.imageUrl || "";
    const fallbackUrl = computeImageUrl(item.image, baseUrl);
    return {
      ...item.toObject(),
      imageUrl: existingUrl || fallbackUrl
    };
  });
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

  const baseUrl = getBaseUrl(req);
  if (req.file) {
    const { image, imageUrl } = resolveImageData(req, baseUrl);
    item.image = image;
    item.imageUrl = imageUrl;
  }

  const updated = await item.save();
  res.json({ ...updated.toObject() });
});
