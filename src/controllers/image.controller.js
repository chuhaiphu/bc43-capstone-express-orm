import initModels from "../models/init-models.js"
import sequelize from "../models/connect.js"
import { responseData } from '../config/response.js'
import { decodeToken } from '../config/jwt.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs/promises';
import { Op } from 'sequelize';

const model = initModels(sequelize);

const uploadImage = async (req, res) => {
  try {
    const file = req.file
    const { mo_ta } = req.body
    const token = req.headers.token

    // Decode the token to get the user ID
    const decodedToken = decodeToken(token)
    const nguoi_dung_id = decodedToken.data.userId

    if (!file) {
      return responseData(400, 'Lỗi', 'Không tìm thấy hình ảnh', null, res)
    }

    const result = await cloudinary.uploader.upload(file.path, { folder: "capstone_express_orm" });

    const newImage = await model.hinh_anh.create({
      ten_hinh: file.filename,
      duong_dan: result.secure_url,
      mo_ta,
      nguoi_dung_id
    });

    // Delete the temporary file
    await fs.unlink(file.path)

    responseData(201, 'Thành công', 'Hình ảnh upload thành công', {
      ten_hinh: newImage.ten_hinh,
      duong_dan: newImage.duong_dan,
      mo_ta: newImage.mo_ta,
      nguoi_dung_id: newImage.nguoi_dung_id
    }, res)

  } catch (error) {
    console.log(error)
    responseData(500, 'Thất bại', 'Upload hình ảnh thất bại', null, res)
  }
};

const getAllImages = async (req, res) => {
  try {
    let data = await model.hinh_anh.findAll()
    responseData(200, 'Thành công', 'Lấy dữ liệu hình ảnh thành công', data, res)
  } catch (error) {
    console.error(error)
    responseData(500, 'Thất bại', 'Lỗi server', null, res)
  }
}

const getImageByName = async (req, res) => {
  try {
    const { ten_hinh } = req.query;
    console.log(ten_hinh);
    let data = await model.hinh_anh.findAll({
      where: {
        ten_hinh: {
          [Op.like]: `%${ten_hinh}%`
        }
      }
    })
    responseData(200, 'Thành công', 'Lấy dữ liệu hình ảnh thành công', data, res)
  } catch (error) {
    console.error(error)
    responseData(500, 'Thất bại', 'Lỗi server', null, res)
  }
}

const getImageById = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    let data = await model.hinh_anh.findByPk(hinh_id, {
      include: [{
        model: model.nguoi_dung,
        as: 'nguoi_dung',
        attributes: ['nguoi_dung_id', 'email', 'ho_ten', 'tuoi', 'anh_dai_dien']
      }]
    });

    if (!data) {
      return responseData(404, 'Thất bại', 'Không tìm thấy hình ảnh', null, res);
    }

    responseData(200, 'Thành công', 'Lấy dữ liệu hình ảnh thành công', data, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const getCommentsByImageId = async (req, res) => {
  try {
    const { hinh_id } = req.params;

    const comments = await model.binh_luan.findAll({
      where: { hinh_id },
      include: [{
        model: model.nguoi_dung,
        as: 'nguoi_dung',
        attributes: ['nguoi_dung_id', 'ho_ten', 'anh_dai_dien']
      }],
      order: [['ngay_binh_luan', 'DESC']]
    });

    responseData(200, 'Thành công', 'Lấy dữ liệu bình luận thành công', comments, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const checkImageSaved = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    const token = req.headers.token;

    // Decode the token to get the user ID
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    const savedImage = await model.luu_anh.findOne({
      where: {
        hinh_id,
        nguoi_dung_id
      }
    });

    const isSaved = savedImage ? true : false;

    responseData(200, 'Thành công', 'Kiểm tra lưu ảnh thành công', { isSaved }, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const tagImage = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    const { tag_names } = req.body;
    console.log(tag_names);

    // Find or create tags
    const tags = await Promise.all(tag_names.map(async (name) => {
      const [tag] = await model.tag.findOrCreate({
        where: { tag_name: name.toLowerCase() }
      });
      return tag;
    }));

    // Find the image
    const image = await model.hinh_anh.findByPk(hinh_id);

    if (!image) {
      return responseData(404, 'Thất bại', 'Không tìm thấy hình ảnh', null, res);
    }
    
    // Remove all existing tags for this image
    await model.hinh_anh_tag.destroy({
      where: { hinh_id: image.hinh_id }
    });
    // Associate tags with the image using hinh_anh_tag model
    await Promise.all(tags.map(tag => 
      model.hinh_anh_tag.findOrCreate({
        where: {
          hinh_id: image.hinh_id,
          tag_id: tag.tag_id
        }
      })
    ));

    responseData(200, 'Thành công', 'Gán tag cho hình ảnh thành công', tags, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const getImageTags = async (req, res) => {
  try {
    const { hinh_id } = req.params;
    const image = await model.hinh_anh.findByPk(hinh_id, {
      include: [{
        model: model.tag,
        through: { attributes: [] },
        as: 'tag_id_tags',
      }]
    });

    if (!image) {
      return responseData(404, 'Thất bại', 'Không tìm thấy hình ảnh', null, res);
    }

    responseData(200, 'Thành công', 'Lấy tags của hình ảnh thành công', image.tag_id_tags, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};

const deleteImage = async (req, res) => {
  try {
    const { hinh_id } = req.params;

    const image = await model.hinh_anh.findOne({ where: { hinh_id } });

    if (!image) {
      return responseData(404, 'Thất bại', 'Không tìm thấy hình ảnh', null, res);
    }

    // Extract the public_id from the Cloudinary URL
    const publicId = image.duong_dan.split('/').slice(-2).join('/').split('.')[0];

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(`${publicId}`);

    // Delete the image from the database
    await model.hinh_anh.destroy({ where: { hinh_id } });

    responseData(200, 'Thành công', 'Xóa hình ảnh thành công', null, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
}

export {
  uploadImage,
  getAllImages,
  getImageByName,
  getImageById,
  getCommentsByImageId,
  checkImageSaved,
  deleteImage,
  tagImage,
  getImageTags
}

