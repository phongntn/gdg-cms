// middlewares/checkEventAuthor.js
const Event = require("../models/event.model");

const checkEventAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // So sánh author với user hiện tại
    // Tùy model của bạn lưu author là username hay userId
    if (event.author !== req.user.username) {
      return res.status(403).json({ message: "Only author can edit or delete this event" });
    }

    req.event = event;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = checkEventAuthor;