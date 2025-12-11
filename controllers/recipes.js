const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");

// INDEX PAGE
// GET /recipes
router.get("/", async (req, res) => {
  try {
    res.locals.recipes = await Recipe.find({ owner: req.session.user._id });
    res.render("recipes/index.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// NEW RECIPE PAGE
// GET /recipes/new
router.get("/new", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render("recipes/new.ejs", { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// CREATE RECIPE
// POST /recipes
router.post("/", async (req, res) => {
  try {
    let ingredients = [];

    if (Array.isArray(req.body.ingredients)) {
      ingredients = req.body.ingredients;
    } else if (req.body.ingredients) {
      ingredients = [req.body.ingredients];
    } else {
      ingredients = [];
    }

    const uniqueIngredients = [...new Set(ingredients)];

    const newRecipe = new Recipe({
      name: req.body.name,
      instructions: req.body.instructions,
      ingredients: uniqueIngredients,
      owner: req.session.user._id,
    });

    await newRecipe.save();
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// SHOW RECIPE PAGE
// GET /recipes/:recipeId
router.get("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate("ingredients")
      .populate("owner");
    res.locals.recipe = recipe;
    res.render("recipes/show.ejs");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//DELETE a recipe
//DELETE /recipes/:recipeId
router.delete("/:recipeId", async (req, res) => {
  try {
    await Recipe.deleteOne({ _id: req.params.recipeId });
    res.redirect("/recipes");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// EDIT: show edit form
// GET /recipes/:recipeId/edit
router.get("/:recipeId/edit", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    const ingredients = await Ingredient.find({});

    const selectedIngredientIds = recipe.ingredients.map((id) => id.toString());

    res.render("recipes/edit.ejs", {
      recipe,
      ingredients,
      selectedIngredientIds,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// UPDATE: handle edit form
// PUT /recipes/:recipeId
router.put("/:recipeId", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);

    recipe.name = req.body.name;
    recipe.instructions = req.body.instructions;

    let ingredients = [];
    if (Array.isArray(req.body.ingredients)) {
      ingredients = req.body.ingredients;
    } else if (req.body.ingredients) {
      ingredients = [req.body.ingredients];
    } else {
      ingredients = [];
    }

    const uniqueIngredients = [...new Set(ingredients)];
    recipe.ingredients = uniqueIngredients;

    await recipe.save();

    res.redirect(`/recipes/${recipe._id}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
