// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const { router } = require("./routes");

// const app = express();
// const PORT = 3001;

// mongoose.connect(
//   process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mealplans_db",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// app.use(cors());
// app.use(express.json());

// app.use("/", router);

// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// module.exports = app;

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { router } = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// Подключение к MongoDB
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

// Настройка CORS, чтобы разрешить запросы с локальной разработки и с твоего фронтенда на Vercel
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://ai-generator-mealplan-client.vercel.app'],
    methods: 'GET,POST',
    credentials: true, // Если нужно работать с куки или авторизацией
  })
);

app.use(express.json()); // Обработка JSON-запросов

// Подключение роутов
app.use("/", router);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

