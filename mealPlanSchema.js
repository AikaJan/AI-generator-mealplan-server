const mongoose = require("mongoose");

const MealPlanSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MealPlan = mongoose.model("MealPlan", MealPlanSchema);

module.exports = MealPlan;
