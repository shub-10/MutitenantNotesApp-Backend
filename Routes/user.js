const express = require("express");
const {handleUserLogin, handleUserSignup, getMe} = require('../Controllers/user');
const {authMiddleware, rolecheck} = require('../middleware/auth');
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/me', authMiddleware, getMe);


module.exports = router;