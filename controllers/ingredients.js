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
    const name = req.body.name?.trim();
    if (!name) {
      return res.redirect("/ingredients");
    }

    await Ingredient.create({ name });
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.redirect("/ingredients");
    }

    res.redirect("/");
  }
});


module.exports = router;
