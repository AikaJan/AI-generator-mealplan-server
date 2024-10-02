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

// Настройка CORS для разрешения запросов с клиента на Vercel
app.use(
  cors({
    origin: "https://ai-generator-mealplan-client.vercel.app", // Разрешаем запросы с Vercel-клиента
    methods: "GET,POST", // Разрешаем только методы GET и POST
    credentials: true,  // Если необходимо работать с авторизацией или куки
  })
);

app.use(express.json()); // Для обработки JSON в запросах

// Подключение роутов
app.use("/", router);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;


module.exports = app;

