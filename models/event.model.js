const mongoose = require('mongoose');
const Counter = require('./counter.model');

const EventSchema = mongoose.Schema(
    {
        eventId: {
            type: Number,
            unique: true
        },

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
        toJSON: {
            transform: function (doc, ret) {
            ret.id = ret.eventId;
            delete ret._id;
            delete ret.__v;
            delete ret.eventId;
            return {
                    id: ret.id,
                    title: ret.title,
                    author: ret.author,
                    content: ret.content,
                    notifyTo: ret.notifyTo,
                    confirmed: ret.confirmed,
                    vote: ret.vote
                };
            }
        }
    }
);

EventSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "eventId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.eventId = counter.seq;
  }
  next();
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;