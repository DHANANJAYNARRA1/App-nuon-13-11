const Notification = require('../models/Notification');
const sock = require('../lib/socket');

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, body, type, payload } = req.body;
    const n = new Notification({ userId, title, body, type, payload });
    await n.save();

    // emit to sockets (server-side will decide routing)
    const io = sock.getIo();
    if (io) {
      io.emit('notification', { event: 'notification:created', title, body, type, payload, id: n._id });
    }

    return res.status(201).json(n);
  } catch (err) {
    console.error('createNotification error', err);
    return res.status(500).json({ error: 'Failed to create notification' });
  }
};

exports.listNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    const query = {};
    if (userId) query.userId = userId;
    const items = await Notification.find(query).sort({ createdAt: -1 }).limit(200);
    return res.json(items);
  } catch (err) {
    console.error('listNotifications error', err);
    return res.status(500).json({ error: 'Failed to list notifications' });
  }
};
