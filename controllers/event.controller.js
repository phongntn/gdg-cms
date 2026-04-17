const Event = require('../models/event.model.js');
const User = require('../models/user.model');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({ message: 'Invalid event id' });
        }

        const event = await Event.findOne({ eventId });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.status(200).json(event);
        } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const createEvent = async (req, res) => {
    
    try {
        const username = req.user?.username;

    if (!username) {
      return res.status(401).json({ message: "Unauthorized: no user found" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const eventData = {
      ...req.body,
      author: username
    };

    const event = await Event.create(eventData);
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const updateEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({ message: 'Invalid event id' });
        }

        const updatedEvent = await Event.findOneAndUpdate(
            { eventId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.status(200).json(updatedEvent);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const eventId = Number(req.params.id);

        if (Number.isNaN(eventId)) {
            return res.status(400).json({ message: 'Invalid event id' });
        }

        const event = await Event.findOneAndDelete({ eventId });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}