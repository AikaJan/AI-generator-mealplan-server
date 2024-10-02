const express = require("express");
const MealPlan = require("./mealPlanSchema");
const OpenAI = require("openai");

const router = express.Router();

async function fetchOpenAICompletionsStream(messages, callback) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const aiModel = "gpt-4";

  try {
    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: messages,
      stream: true,
    });

    for await (const chunk of completion) {
      callback(chunk);
    }
  } catch (error) {
    console.error("Error fetching OpenAI completions:", error);
    throw new Error("OpenAI API Error");
  }
}

router.get("/recipeStream", (req, res) => {
  let ingredients = req.query.ingredients?.trim();
  let mealType = req.query.mealType?.trim();
  let mealPlan = req.query.mealPlan?.trim();

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (chunk) => {
    let chunkResponse;
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      chunkResponse =
        chunk.choices[0].delta.role === "assistant"
          ? { action: "start" }
          : { action: "chunk", chunk: chunk.choices[0].delta.content };

      res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    }
  };

  if (mealPlan) {
    const prompt = [
      "Generate a detailed 7-day gluten and sugar-free meal plan.",
      mealPlan,
    ];

    const messages = [{ role: "system", content: prompt.join(" ") }];
    fetchOpenAICompletionsStream(messages, sendEvent);
    req.on("close", () => res.end());
  } else if (ingredients && mealType) {
    const prompt = [
      "Generate a recipe that incorporates the following details:",
      `[Ingredients: ${ingredients}]`,
      `[Meal Type: ${mealType}]`,
      "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients.",
      "The recipe should highlight the fresh and vibrant nature of the ingredients.",
      "Format the ingredient list so that each subsequent step and ingredient appears on a new line, paragraph, and keep the text to 2,300 words or less.",
    ];

    const messages = [{ role: "system", content: prompt.join(" ") }];
    fetchOpenAICompletionsStream(messages, sendEvent);
    req.on("close", () => res.end());
  } else {
    res.status(400).json({
      error:
        "Missing required parameters. Provide ingredients, mealType, or mealPlan.",
    });
  }
});

router.post("/savePlan", async (req, res) => {
  const { mealPlan } = req.body;

  if (!mealPlan) {
    return res.status(400).json({ error: "mealPlan is required" });
  }

  try {
    const newMealPlan = new MealPlan({ plan: mealPlan });
    await newMealPlan.save();
    res.status(200).json({ message: "Meal plan saved successfully!" });
  } catch (error) {
    console.error("Error saving meal plan:", error);
    res.status(500).json({ error: "Failed to save meal plan" });
  }
});

router.get("/getPlan", async (req, res) => {
  try {
    const plans = await MealPlan.find().sort({ createdAt: -1 });
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching meal plans:", error);
    res.status(500).json({ error: "Failed to fetch meal plans" });
  }
});

module.exports = {
  fetchOpenAICompletionsStream,
  router,
};
