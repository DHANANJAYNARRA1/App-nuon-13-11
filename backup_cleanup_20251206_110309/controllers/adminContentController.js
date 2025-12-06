const Workshop = require('../models/Workshop');
const Session = require('../models/Session');
const logger = require('../utils/logger');
const { getSocket } = require('../utils/socket');

// Workshops
const listWorkshops = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, published } = req.query;
    const filter = {};
    if (q) filter.title = new RegExp(q, 'i');
    if (published !== undefined) filter.isPublished = published === 'true';
    const workshops = await Workshop.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    const total = await Workshop.countDocuments(filter);
    res.json({ workshops, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
  } catch (err) {
    logger.error('listWorkshops', err.message);
    res.status(500).json({ message: err.message });
  }
};

const createWorkshop = async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.slug) return res.status(400).json({ message: 'title and slug required' });
    const existing = await Workshop.findOne({ slug: data.slug });
    if (existing) return res.status(409).json({ message: 'slug already exists' });
    const workshop = new Workshop({ ...data, createdBy: req.user._id });
    await workshop.save();

    // Emit socket event
    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:workshop:created', { workshopId: workshop._id, title: workshop.title, slug: workshop.slug });
    } catch (e) {
      logger.warn('workshop create emit failed', e.message);
    }

    res.status(201).json({ workshop });
  } catch (err) {
    logger.error('createWorkshop', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id).populate('mentors', 'name email role');
    if (!workshop) return res.status(404).json({ message: 'Not found' });
    res.json({ workshop });
  } catch (err) {
    logger.error('getWorkshop', err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateWorkshop = async (req, res) => {
  try {
    const updates = req.body;
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!workshop) return res.status(404).json({ message: 'Not found' });

    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:workshop:updated', { workshopId: workshop._id });
    } catch (e) {
      logger.warn('workshop update emit failed', e.message);
    }

    res.json({ workshop });
  } catch (err) {
    logger.error('updateWorkshop', err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Not found' });

    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:workshop:deleted', { workshopId: workshop._id });
    } catch (e) {
      logger.warn('workshop delete emit failed', e.message);
    }

    res.json({ message: 'deleted' });
  } catch (err) {
    logger.error('deleteWorkshop', err.message);
    res.status(500).json({ message: err.message });
  }
};

// Sessions
const listSessions = async (req, res) => {
  try {
    const { page = 1, limit = 20, workshopId } = req.query;
    const filter = {};
    if (workshopId) filter.workshopId = workshopId;
    const sessions = await Session.find(filter)
      .sort({ startsAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    const total = await Session.countDocuments(filter);
    res.json({ sessions, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
  } catch (err) {
    logger.error('listSessions', err.message);
    res.status(500).json({ message: err.message });
  }
};

const createSession = async (req, res) => {
  try {
    const data = req.body;
    if (!data.workshopId || !data.title) return res.status(400).json({ message: 'workshopId and title required' });
    const session = new Session(data);
    await session.save();

    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:session:created', { sessionId: session._id, workshopId: session.workshopId, title: session.title });
    } catch (e) {
      logger.warn('session create emit failed', e.message);
    }

    res.status(201).json({ session });
  } catch (err) {
    logger.error('createSession', err.message);
    res.status(500).json({ message: err.message });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate('mentors', 'name email role');
    if (!session) return res.status(404).json({ message: 'Not found' });
    res.json({ session });
  } catch (err) {
    logger.error('getSession', err.message);
    res.status(500).json({ message: err.message });
  }
};

const updateSession = async (req, res) => {
  try {
    const updates = req.body;
    const session = await Session.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!session) return res.status(404).json({ message: 'Not found' });

    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:session:updated', { sessionId: session._id });
    } catch (e) {
      logger.warn('session update emit failed', e.message);
    }

    res.json({ session });
  } catch (err) {
    logger.error('updateSession', err.message);
    res.status(500).json({ message: err.message });
  }
};

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Not found' });

    try {
      const io = getSocket && getSocket();
      if (io) io.emit('content:session:deleted', { sessionId: session._id });
    } catch (e) {
      logger.warn('session delete emit failed', e.message);
    }

    res.json({ message: 'deleted' });
  } catch (err) {
    logger.error('deleteSession', err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  listWorkshops,
  createWorkshop,
  getWorkshop,
  updateWorkshop,
  deleteWorkshop,
  listSessions,
  createSession,
  getSession,
  updateSession,
  deleteSession
};
