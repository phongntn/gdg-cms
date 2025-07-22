const express = require('express');
const app = express();
const mongoose = require('mongoose');

const postRoute = require('./routes/post.route.js');

const eventRoute = require('./routes/event.route.js');

require("dotenv").config();
const host = process.env.HOST;
const password = process.env.PASSWORD;
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use("/posts", postRoute);

app.use("/events", eventRoute);

app.get("/", (req, res) => {
    res.send('Hello World!!!!!');
});

mongoose.connect(`mongodb+srv://${host}:${password}@backenddb.zeezh.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB`)
.then(() => {
    console.log("Connected to database!");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
})
.catch(() => {
    console.log("Connection failed!");
});