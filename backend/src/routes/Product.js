const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authMiddleWare } = require('../middleware/authMiddleWare');



router.post('/create', ProductController.create);
router.get('/all', authMiddleWare, ProductController.getAll);
router.get("/detail/:id", authMiddleWare, ProductController.getDetail);
router.put('/update/:id', authMiddleWare, ProductController.update);
router.delete("/delete/:id", authMiddleWare, ProductController.deleteProduct);

module.exports = router;