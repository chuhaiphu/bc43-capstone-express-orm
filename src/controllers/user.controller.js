import initModels from "../models/init-models.js"
import sequelize from "../models/connect.js"
import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import bcrypt from 'bcrypt';
import { responseData } from '../config/response.js'
import { decodeToken } from '../config/jwt.js';

const model = initModels(sequelize);

const getUserInfo = async (req, res) => {
  try {
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const user = await model.nguoi_dung.findByPk(nguoi_dung_id, {
      attributes: ['nguoi_dung_id', 'email', 'ho_ten', 'tuoi', 'anh_dai_dien']
    });

    if (!user) {
      return responseData(404, 'Thất bại', 'Không tìm thấy người dùng', null, res);
    }

    responseData(200, 'Thành công', 'Lấy thông tin người dùng thành công', user, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};


const getSavedImages = async (req, res) => {
  try {
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const savedImages = await model.luu_anh.findAll({
      where: { nguoi_dung_id },
      include: [{
        model: model.hinh_anh,
        as: 'hinh'
      }]
    });

    responseData(200, 'Thành công', 'Lấy danh sách ảnh đã lưu thành công', savedImages, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const getCreatedImages = async (req, res) => {
  try {
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const createdImages = await model.hinh_anh.findAll({
      where: { nguoi_dung_id }
    });

    responseData(200, 'Thành công', 'Lấy danh sách ảnh đã tạo thành công', createdImages, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const saveImage = async (req, res) => {
  try {
    const { hinh_id } = req.query;
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const [savedImage, created] = await model.luu_anh.findOrCreate({
      where: { nguoi_dung_id, hinh_id },
      defaults: { ngay_luu: new Date() }
    });

    if (!created) {
      return responseData(400, 'Thất bại', 'Hình ảnh đã được lưu trước đó', null, res);
    }

    responseData(201, 'Thành công', 'Lưu hình ảnh thành công', savedImage, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { ho_ten, tuoi } = req.body;
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const updatedUser = await model.nguoi_dung.update(
      { ho_ten, tuoi },
      { where: { nguoi_dung_id } }
    );

    if (updatedUser[0] === 0) {
      return responseData(404, 'Thất bại', 'Không tìm thấy người dùng', null, res);
    }

    const user = await model.nguoi_dung.findByPk(nguoi_dung_id);
    responseData(200, 'Thành công', 'Cập nhật thông tin thành công', user, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    if (!file) {
      return responseData(400, 'Lỗi', 'Không tìm thấy hình ảnh', null, res);
    }

    const result = await cloudinary.uploader.upload(file.path, { 
      folder: `capstone_express_orm/profile_pictures/${nguoi_dung_id}` 
    });
    
    const updatedUser = await model.nguoi_dung.update(
      { anh_dai_dien: result.secure_url },
      { where: { nguoi_dung_id } }
    );

    await fs.unlink(file.path);

    if (updatedUser[0] === 0) {
      return responseData(404, 'Thất bại', 'Không tìm thấy người dùng', null, res);
    }

    const user = await model.nguoi_dung.findByPk(nguoi_dung_id);
    responseData(200, 'Thành công', 'Cập nhật ảnh đại diện thành công', user, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const { mat_khau_hien_tai, mat_khau_moi, xac_nhan_mat_khau_moi } = req.body;
    const token = req.headers.token;
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    // Empty password validation
    if (!mat_khau_hien_tai || !mat_khau_moi || !xac_nhan_mat_khau_moi) {
      return responseData(400, 'Thất bại', 'Mật khẩu không được để trống', null, res);
    }

    // Confirm password validation
    if (mat_khau_moi !== xac_nhan_mat_khau_moi) {
      return responseData(400, 'Thất bại', 'Mật khẩu mới và xác nhận mật khẩu không khớp', null, res);
    }

    const user = await model.nguoi_dung.findByPk(nguoi_dung_id);

    if (!user) {
      return responseData(404, 'Thất bại', 'Không tìm thấy người dùng', null, res);
    }

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(mat_khau_hien_tai, user.mat_khau);
    if (!isPasswordValid) {
      return responseData(400, 'Thất bại', 'Mật khẩu hiện tại không đúng', null, res);
    }

    const hashedPassword = bcrypt.hashSync(mat_khau_moi, 10);

    // Update password
    await model.nguoi_dung.update(
      { mat_khau: hashedPassword },
      { where: { nguoi_dung_id } }
    );

    responseData(200, 'Thành công', 'Đổi mật khẩu thành công', null, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

export {
  getUserInfo,
  getSavedImages,
  getCreatedImages,
  saveImage,
  updateUserInfo,
  updateProfilePicture,
  changePassword
};
