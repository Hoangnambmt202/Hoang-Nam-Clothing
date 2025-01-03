const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleWare } = require('../middleware/authMiddleWare');


router.post('/sign-up', UserController.createUser);
router.post('/sign-in', UserController.loginUser);
router.put('/update/:id', UserController.updateUser);
router.delete("/delete/:id", authMiddleWare, UserController.deleteUser);

module.exports = router;