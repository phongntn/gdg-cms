const express = require('express');
const serverless = require('serverless-http');
const app = express();
const mongoose = require('mongoose');

const postRoute = require('../routes/post.route.js');
const eventRoute = require('../routes/event.route.js');
const storageRoute = require('../routes/storage.route.js');
const userRoute = require('../routes/user.route.js');
const authRoute = require('../routes/auth.route.js');
const connectDB = require('../dbconnect.js')

const apiRouter = express.Router();

require("dotenv").config();
const host = process.env.HOST;
const password = process.env.PASSWORD;
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
apiRouter.use("/posts", postRoute);
apiRouter.use("/events", eventRoute);
apiRouter.use("/storage", storageRoute);
apiRouter.use("/users", userRoute);
apiRouter.use(authRoute);

app.use('/', apiRouter);



app.get('/', (req, res) => {
    res.send('CMS backend');
});

connectDB();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// mongoose.connect(process.env.MONGO_URL)
// .then(() => {
//     console.log("Connected to database!");
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//     })
// })
// .catch(() => {
//     console.log("Connection failed!");
// });

module.exports = app;