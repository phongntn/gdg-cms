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
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

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
        const { id } = req.params;

        const event = await Event.findByIdAndUpdate(id, req.body);
        
        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        const updatedEvent = await Event.findById(id);
        res.status(200).json({updatedEvent});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({message: "Event not found"});
        }

        res.status(200).json({message: "Event deleted successfully"});

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent
}