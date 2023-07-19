const express = require("express");
const router = express.Router();
const {
  createActor,
  removeActor,
  searchActor,
  getLatestActors,
  getSingleActor,
  getActors,
} = require("../controller/actor");
const { uploadImage } = require("../middleware/multer");
const { actorInfoValidator, validate } = require("../middleware/validator");
const { updateActor } = require("../controller/actor");
const { isAuth, isAdmin } = require("../middleware/auth");

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);
router.post(
  "/update/:actorId",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);

router.delete("/:actorId", isAuth, isAdmin, removeActor);
router.get("/search", isAuth, isAdmin, searchActor);
router.get("/latest-uploads", isAuth, isAdmin, getLatestActors);
router.get("/actors", isAuth, isAdmin, getActors )
router.get("/single/:id", getSingleActor);

module.exports = router;
