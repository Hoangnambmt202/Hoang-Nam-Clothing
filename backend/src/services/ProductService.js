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


// const getAllProduct = (limit, page, sortField, sortOrder) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sortOption = { [sortField]: sortOrder }; // Tạo object sắp xếp, ví dụ: {_id: -1}
//       const totalProduct = await Product.countDocuments(); // lấy tổng số lượng sản phẩm
//       const products = await Product.find()
//         .sort(sortOption) // lấy sản phẩm có phân trang bằng limit và next
//         .limit(limit)
//         .skip(Number(page - 1) * limit)
//       console.log("Skip:", (page - 1) * limit);
//       resolve({
//         status: "OK",
//         message: "Lấy danh sách sản phẩm thành công",
//         totalProduct: totalProduct,
//         pageCurrent: Number(page),
//         totalPage: Math.ceil(totalProduct / limit),
//         data: products,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getAllProduct = (limit, page, sortField, sortOrder) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Xử lý các giá trị mặc định
      const sortFieldValue = sortField || "_id"; // Mặc định sắp xếp theo `_id` nếu không có sortField
      const sortOrdeValue= sortOrder === "asc" ? 1 : -1; // Sắp xếp tăng dần (1) hoặc giảm dần (-1)

      const totalProduct = await Product.countDocuments(); // Lấy tổng số lượng sản phẩm
      const products = await Product.find()
        .sort({ [sortFieldValue]: sortOrdeValue }) // Sắp xếp theo trường được chỉ định
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
