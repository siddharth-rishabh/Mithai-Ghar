import Sweet from "../models/sweet";

export const addSweet = async (req, res) => {
  try {
    const sweet = await Sweet.create(req.body);
    res.status(201).json({ success: true, sweet });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message
    });
  }
};

export const getSweets = async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json({ success: true, sweets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {
        $gte: Number(minPrice) || 0,
        $lte: Number(maxPrice) || 999999
      };
    }

    const sweets = await Sweet.find(filter);
    res.json({ success: true, sweets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSweet = async (req, res) => {
  try {
    const updated = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteSweet = async (req, res) => {
  try {
    const deleted = await Sweet.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Sweet deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const purchaseSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet)
      return res.status(404).json({ success: false, message: "Not found" });

    if (sweet.quantity <= 0)
      return res.status(400).json({ success: false, message: "Out of stock" });

    sweet.quantity -= 1;
    await sweet.save();

    res.json({ success: true, message: "Purchase successful", sweet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const restockSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet)
      return res.status(404).json({ success: false, message: "Not found" });

    sweet.quantity += Number(req.body.amount || 1);
    await sweet.save();

    res.json({ success: true, message: "Restocked", sweet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
