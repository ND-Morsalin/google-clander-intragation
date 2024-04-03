const { googleAuthController, googleAuthCallback } = require("../controller/google");


const router = require("express").Router();

// Import the controller

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

router.get('/google', googleAuthController);

router.get('/google/redirect', googleAuthCallback);

// Export the router
module.exports = router;
