const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");
const Ingredient = require("../models/ingredient.js");

// INGREDIENTS INDEX PAGE
// GET /ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.render("ingredients/index.ejs", { ingredients });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// CREATE INGREDIENT
// POST /ingredients
router.post("/", async (req, res) => {
  try {
    await Ingredient.create(req.body);
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);
    res.redirect("/ingredients");
  }
});

module.exports = router;
