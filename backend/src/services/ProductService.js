const Product = require("../models/Product");
const bcrypt = require("bcrypt");
const { generalAccessToken, generateRefreshToken } = require("./JwtService");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
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
    } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ÔK",
          message: "the product is already",
        });
      }

      const createdProduct = await Product.create({
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
      });
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Create product successfully",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      })
      if(checkProduct === null) {
        resolve({
          status: "OK",
          message: "Không tìm thấy sản phẩm, vui lòng thử lại",
        })
      }
      const updatedProduct = await Product.findByIdAndUpdate(id, data, {new: true});
      resolve({
        status: "OK",
        message: `Cập nhật thành công cho sản phẩm: ${updatedProduct.name}`,
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};


const getAllProduct = (limit, page, sortBy, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      //filter 
      const label = filter[0];
      const allObjectFilter = await Product.find({[label]: {'$regex': filter[1]}}).limit(limit).skip((page - 1) * limit);
      resolve({
        status: "OKE",
        message: "success",
        data: allObjectFilter,
      })
      // Xử lý giá trị mặc định cho sắp xếp
      const sortOptions = {
        "newest": { createdAt: -1 },
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
      };
      const sortCriteria = sortOptions[sortBy] || { createdAt: -1 };

      const totalProduct = await Product.countDocuments();
      const products = await Product.find()
        .sort(sortCriteria)
        .limit(limit)
        .skip((page - 1) * limit);

      resolve({
        status: "OK",
        message: "Lấy danh sách sản phẩm thành công",
        totalProduct: totalProduct,
        pageCurrent: Number(page),
        totalPage: Math.ceil(totalProduct / limit),
        data: products,
      });
    } catch (e) {
      reject(e);
    }
  });
};




const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
        if (checkProduct === null) {
            resolve({
            status: "OK",
            message: "Không tìm thấy sản phẩm",
            });
        }
        resolve({
            status: "OK",
            message: "Lấy thông tin sản phẩm thành công",
            data: checkProduct,
        });
        console.log("Lấy sản phẩm thành công :", checkProduct);

    } catch (e) {
        reject(e);
    }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
        const checkProduct = await Product
            .findOne({
            _id: id,
            });
        if (checkProduct === null) {
            resolve({
            status: "OK",
            message: "Không tìm thấy sản phẩm",
            });
        }
        await Product.findByIdAndDelete(id);
        resolve({
            status: "OK",
            message: "Xóa sản phẩm thành công",
        });
        } catch (e) {
        reject(e);
        }
    }
    );
}

module.exports = {
    createProduct,
    updateProduct,
    getAllProduct,
    getDetailProduct,
    deleteProduct,
};
