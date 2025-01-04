const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authMiddleWare');



router.post('/create', ProductController.create);
router.put('/update/:id', authMiddleWare, ProductController.update);
router.get("/detail/:id", authMiddleWare, ProductController.getDetail);
router.delete("/delete/:id", authMiddleWare, ProductController.deleteProduct);

module.exports = router;