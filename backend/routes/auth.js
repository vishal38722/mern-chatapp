const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  getUserById,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.get("/getuser/:id", getUserById);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
