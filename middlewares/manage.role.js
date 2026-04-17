const User = require('../models/user.model');

const roleLevel = {
  Member: 1,
  Leader: 2,
  Admin: 3
};

const canManageRole = async (req, res, next) => {
  try {
    const currentUser = await User.findOne({ username: req.user.username });
    const targetUserId = Number(req.params.id);
    const { role: newRole } = req.body;

    if (Number.isNaN(targetUserId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const targetUser = await User.findOne({ userId: targetUserId });

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!roleLevel[newRole]) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (currentUser.userId === targetUser.userId) {
      return res.status(403).json({ message: 'You cannot change your own role' });
    }

    if (roleLevel[currentUser.role] <= roleLevel[targetUser.role]) {
      return res.status(403).json({
        message: 'You can only change role of users lower than you'
      });
    }

    if (roleLevel[currentUser.role] <= roleLevel[newRole]) {
      return res.status(403).json({
        message: 'You can only assign roles lower than your own role'
      });
    }

    req.targetUser = targetUser;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = canManageRole;