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
const PORT = process.env.PORT || 3001;  // Используем переменную окружения для порта

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

// Настройка CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-url.vercel.app'], // Разрешенные источники
  methods: 'GET,POST,PUT,DELETE',  // Разрешенные методы
  credentials: true  // Если работаешь с куки или авторизацией
}));

app.use(express.json());  // Для обработки JSON данных в запросах

// Подключаем роуты
app.use("/", router);

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
