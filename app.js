const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { MONGO_URL } = require('./config/keys');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

mongoose
    .connect(MONGO_URL, { useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully connected");
    })
    .catch(() => {
        console.log("Something went wrong");
    });



app.use(bodyParser.json());
require('./models/user');
require('./models/post');
    
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

if(process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'));
    const path = require('path');
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname + 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log("Serving at PORT " + PORT);
});