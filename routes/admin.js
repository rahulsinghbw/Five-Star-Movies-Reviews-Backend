const { getAppInfo, getMostRated } = require("../controller/admin");
const { isAuth, isAdmin } = require("../middleware/auth");

const router = require("express").Router();

router.get("/app-info", isAuth, isAdmin, getAppInfo);
router.get("/most-rated", isAuth, isAdmin, getMostRated);

module.exports = router;
