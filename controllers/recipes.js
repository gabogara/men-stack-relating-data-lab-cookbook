const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Recipe = require("../models/recipe.js");

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ owner: req.session.user._id });
    res.render("recipes/index.ejs", { recipes });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
