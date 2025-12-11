const express = require("express");
const router = express.Router();

const Ingredient = require("../models/ingredient.js");

// INGREDIENTS INDEX PAGE
// GET /ingredients
router.get("/", async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    const isDuplicate = req.query.duplicate === "1";

    res.render("ingredients/index.ejs", {
      ingredients,
      isDuplicate,
    });
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

    const existing = await Ingredient.findOne({ name });
    if (existing) {

      return res.redirect("/ingredients?duplicate=1");
    }

    await Ingredient.create({ name });
    res.redirect("/ingredients");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
