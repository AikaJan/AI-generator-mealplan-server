const mongoose = require("mongoose");
const MealPlan = require("../mealPlanSchema");

describe("MealPlan Schema", () => {
  it("should create a meal plan with required fields", () => {
    const mealPlanData = {
      plan: "Sample Meal Plan",
    };

    const mealPlan = new MealPlan(mealPlanData);

    expect(mealPlan.plan).toBe(mealPlanData.plan);
    expect(mealPlan.createdAt).toBeDefined();
  });

  it("should fail if required fields are missing", () => {
    const mealPlan = new MealPlan();

    const validationError = mealPlan.validateSync();
    expect(validationError.errors.plan).toBeDefined();
  });
});
