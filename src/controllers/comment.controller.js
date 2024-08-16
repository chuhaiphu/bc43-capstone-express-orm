import initModels from "../models/init-models.js"
import sequelize from "../models/connect.js"
import { responseData } from '../config/response.js'
import { decodeToken } from '../config/jwt.js';

const model = initModels(sequelize);

const createComment = async (req, res) => {
  try {
    const { hinh_id, noi_dung } = req.body;
    const token = req.headers.token;

    // Validate comment content
    if (!noi_dung || noi_dung.trim() === '') {
      return responseData(400, 'Thất bại', 'Nội dung bình luận không được để trống', null, res);
    }

    // Decode the token to get the user ID
    const decodedToken = decodeToken(token);
    const nguoi_dung_id = decodedToken.data.userId;

    // Check if the image exists
    const image = await model.hinh_anh.findByPk(hinh_id);
    if (!image) {
      return responseData(404, 'Thất bại', 'Không tìm thấy hình ảnh', null, res);
    }

    const newComment = await model.binh_luan.create({
      nguoi_dung_id,
      hinh_id,
      noi_dung
    });

    responseData(201, 'Thành công', 'Bình luận đã được tạo', newComment, res);
  } catch (error) {
    console.error(error);
    responseData(500, 'Thất bại', 'Lỗi server', null, res);
  }
};


export {
  createComment
};
