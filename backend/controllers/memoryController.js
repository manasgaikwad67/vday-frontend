const Memory = require("../models/Memory");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "memories");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  cb(null, ext && mime);
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

exports.create = async (req, res) => {
  try {
    const { title, caption, date } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const imageUrl = `/uploads/memories/${req.file.filename}`;
    const memory = await Memory.create({ title, caption, date, imageUrl });

    res.status(201).json({ success: true, memory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAll = async (_req, res) => {
  try {
    const memories = await Memory.find().sort({ date: 1 });
    res.json({ success: true, memories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, caption, date } = req.body;
    const updateData = { title, caption, date };

    if (req.file) {
      updateData.imageUrl = `/uploads/memories/${req.file.filename}`;
    }

    const memory = await Memory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!memory) {
      return res.status(404).json({ success: false, message: "Memory not found" });
    }

    res.json({ success: true, memory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const memory = await Memory.findByIdAndDelete(req.params.id);
    if (!memory) {
      return res.status(404).json({ success: false, message: "Memory not found" });
    }

    // Remove image file
    const imagePath = path.join(__dirname, "..", memory.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ success: true, message: "Memory deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
