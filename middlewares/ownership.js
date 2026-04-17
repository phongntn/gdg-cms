const Event = require('../models/event.model');
const Post = require('../models/post.model');

const ownership = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    let resource = null;

    if (req.baseUrl.includes('/events')) {
      resource = await Event.findOne({ eventId: id });
      if (!resource) {
        return res.status(404).json({ message: 'Event not found' });
      }
    } else if (req.baseUrl.includes('/posts')) {
      resource = await Post.findOne({ postId: id });
      if (!resource) {
        return res.status(404).json({ message: 'Post not found' });
      }
    } else {
      return res.status(400).json({ message: 'Unsupported resource type' });
    }

    if (resource.author !== req.user.username) {
      return res.status(403).json({
        message: 'Only author can edit or delete this resource'
      });
    }

    req.resource = resource;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = ownership;