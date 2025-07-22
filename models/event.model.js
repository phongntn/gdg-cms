const mongoose = require('mongoose');

const EventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        notifyTo: {
            type: [String],
            required: true
        },

        confirmed: {
            type: [String],
            required: true
        },
        
        vote: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;