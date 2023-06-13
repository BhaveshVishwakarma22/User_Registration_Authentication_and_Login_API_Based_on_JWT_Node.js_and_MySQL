const express = require('express');
const { 
    registerUser,
    loginUser, 
    currentUser,
    getAlluser 
} = require('../controller/userController');
const validateToken = require('../middleware/validateTokenHandler');


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/", getAlluser);

router.get("/current", validateToken, currentUser);



module.exports = router;