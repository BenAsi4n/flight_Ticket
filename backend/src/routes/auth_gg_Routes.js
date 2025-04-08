// const express = require("express");
// const passport = require("passport");
// const router = express.Router();
// const authController = require("../controllers/ auth_gg_Controller");

// router.get("/google", passport.authenticate("google", {
//   scope: ["profile", "email"]
// }));

// router.get("/google/callback", 
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/auth/google/profile"); // redirect 
//   }
// );

// router.get("/google/profile", authController.googleLogin);
// router.get("/logout", authController.logout);

// module.exports = router;
