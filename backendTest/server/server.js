const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Body parser middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/api", (req, res) => {
    res.json({"users": ["dan", "james", "andrew"]});
});

// POST route to handle incoming data
app.post("/sendData", (req, res) => {
    console.log("Received data:", req.body);
    // Process the data as needed...

    // Send a JSON response
    res.status(200).json({ message: "Data received" });
});

app.listen(5000, () => { console.log("Server started on port 5000") });
