const express = require("express");
const { isAuth, isAdmin } = require("../middleware/auth");
const {
  uploadTrailer,
  createMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
  searchPublicMovies,
} = require("../controller/movie");
const { uploadVideo, uploadImage } = require("../middleware/multer");
const { parseData } = require("../utils/helper");
const {
  validateMovie,
  validate,
  validateTrailer,
} = require("../middleware/validator");
const router = express.Router();

router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

// router.patch(
//   "/update-movie-without-poster/:movieId",
//   isAuth,
//   isAdmin,
//   // parseData,
//   validateMovie,
//   validate,
//   updateMovieWithoutPoster
// );

router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  // validateTrailer,
  validate,
  updateMovie
);
router.delete("/:movieId", isAuth, isAdmin, removeMovie);
router.get("/movies", isAuth, isAdmin, getMovies);
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);
router.get('/search',isAuth,isAdmin,searchMovies)  


// for normal user 
router.get('/latest-uploads', getLatestUploads)
router.get('/single/:movieId', getSingleMovie) // Here movieId is params
router.get('/related/:movieId', getRelatedMovies) 
router.get('/top-rated', getTopRatedMovies) 
router.get('/search-public', searchPublicMovies) 


module.exports = router;
