require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { router } = require("./routes");

const app = express();

const PORT = 3001;

// Настройка CORS с несколькими разрешенными источниками
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-generator-mealplan-server.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST", // Разрешенные HTTP методы
    allowedHeaders: "Content-Type,Authorization", // Разрешенные заголовки
  })
);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mealplans_db",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use("/", router);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;


