const mongoose = require("mongoose");

const FileSchema = mongoose.Schema(
    {
        uploader: {
            type: String,
            require: true
        },
        URL: {
            type: String,
            require: true
        }
    },
    {
        timestamps: true
    }
)

const File = mongoose.model("File", FileSchema);

module.exports = File;