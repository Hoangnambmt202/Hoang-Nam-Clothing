const ProductService = require('../services/ProductService');

const create = async (req, res) => {
    try {
        const {
          name,
          description,
          price,
          category,
          brand,
          sizes,
          colors,
          images,
          stock,
          ratings,
          isFeatured,
        } = req.body;

        if (!name || !description || !price || !category || !stock || !sizes || !colors || !images ) {
            return res.status(400).json({
                status: "failed",
                message: "Please fill in all required fields",
            });
        }
        const response = await ProductService.createProduct(req.body);
       

        return res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message,
        });
    }

}
const update = async (req, res) => {
  try {
    const productId = req.params.id;

    const data = req.body;
    if (!productId) {
      return res.status(400).json({
        status: "failed",
        message: "Không tìm thấy sản phẩm",
      });
    }
    const response = await ProductService.updateProduct(productId ,data);
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};

const getAll = async (req, res) => {
    try {
      const {limit, page } = req.query;
      const response = await ProductService.getAllProduct(Number(limit), Number(page - 1));
      return res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message,
        });
    }
}

const getDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "failed",
        message: "Không tìm thấy sản phẩm",
      });
    }
    const response = await ProductService.getDetailProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "failed",
        message: "Không tìm thấy sản phẩm",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
module.exports = {
    create,
    update,
    getAll,
    getDetail,
    deleteProduct,
};
