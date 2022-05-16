// Initialize & Configure Server
const express = require("express");
const path = require("path");
const server = express();
server.use(express.json());
server.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:500000}));

// Initialize & Configure MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@main.doxhq.mongodb.net/geolocalisation-api?retryWrites=true&w=majority').then(
  console.log('Database connected')
).catch(err => console.log(err));

// Import Controllers
const communeController = require("./routes/communeController");

// Configure Routes
server.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});

// Initiate routes from controller(s)
server.use("/api/geo-france", communeController);

// Listening 
server.listen("8101", function () {
  console.log("Server running");
});