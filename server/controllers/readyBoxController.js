import ReadyBox from "../models/ReadyBox.js";

// GET /api/readyboxes — list all active ready boxes (public)
export const getReadyBoxes = async (req, res) => {
  try {
    const boxes = await ReadyBox.find({ isActive: true })
      .populate("giftBox")
      .populate("items.product");
    res.json(boxes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/readyboxes/all — list ALL ready boxes including inactive (admin)
export const getAllReadyBoxes = async (req, res) => {
  try {
    const boxes = await ReadyBox.find()
      .populate("giftBox")
      .populate("items.product");
    res.json(boxes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/readyboxes/:id — single ready box
export const getReadyBox = async (req, res) => {
  try {
    const box = await ReadyBox.findById(req.params.id)
      .populate("giftBox")
      .populate("items.product");
    if (!box) return res.status(404).json({ error: "Ready box not found" });
    res.json(box);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/readyboxes — create (admin)
export const createReadyBox = async (req, res) => {
  try {
    const { name, description, giftBox, items, image } = req.body;
    // Auto-calculate total price from items
    const ReadyBoxModel = ReadyBox; // just for clarity
    const box = new ReadyBoxModel({ name, description, giftBox, items, image });

    // We need to populate items to calculate price
    await box.populate("items.product");
    await box.populate("giftBox");

    let itemsTotal = 0;
    for (const item of box.items) {
      itemsTotal += (item.product?.price || 0) * item.quantity;
    }
    box.totalPrice = (box.giftBox?.basePrice || 0) + itemsTotal;

    await box.save();
    res.status(201).json(box);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/readyboxes/:id — update (admin)
export const updateReadyBox = async (req, res) => {
  try {
    const { name, description, giftBox, items, image, isActive } = req.body;
    const box = await ReadyBox.findById(req.params.id);
    if (!box) return res.status(404).json({ error: "Ready box not found" });

    if (name !== undefined) box.name = name;
    if (description !== undefined) box.description = description;
    if (giftBox !== undefined) box.giftBox = giftBox;
    if (items !== undefined) box.items = items;
    if (image !== undefined) box.image = image;
    if (isActive !== undefined) box.isActive = isActive;

    // Recalculate price
    await box.populate("items.product");
    await box.populate("giftBox");
    let itemsTotal = 0;
    for (const item of box.items) {
      itemsTotal += (item.product?.price || 0) * item.quantity;
    }
    box.totalPrice = (box.giftBox?.basePrice || 0) + itemsTotal;

    await box.save();
    res.json(box);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/readyboxes/:id — delete (admin)
export const deleteReadyBox = async (req, res) => {
  try {
    await ReadyBox.findByIdAndDelete(req.params.id);
    res.json({ message: "Ready box deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
