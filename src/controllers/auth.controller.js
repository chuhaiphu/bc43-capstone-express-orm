import initModels from "../models/init-models.js"
import sequelize from "../models/connect.js"
import { responseData } from '../config/response.js'
import bcrypt from 'bcrypt'
import { createRefreshToken, createToken, verifyToken, verifyRefreshToken, decodeToken } from "../config/jwt.js"

const model = initModels(sequelize);

const signUp = async (req, res) => {

    let { email, mat_khau, ho_ten, tuoi } = req.body;

    // check trùng email
    let checkEmail = await model.nguoi_dung.findOne({
        where: {
            email
        }
    })

    // response.send() không giúp dừng câu lệnh 
    if (checkEmail) {
        responseData(409, "Lỗi", "Email đã tồn tại !", "", res);
        return;
    }

    let newUser = {
        email,
        mat_khau: bcrypt.hashSync(mat_khau, 10),
        tuoi,
        ho_ten,
        anh_dai_dien: "",
        refresh_token: ""
    }

    await model.nguoi_dung.create(newUser)

    responseData(201, "Thành công", "Đăng ký thành công", "", res);

}

const login = async (req, res) => {
    let { email, mat_khau } = req.body;

    let checkEmail = await model.nguoi_dung.findOne({
        where: {
            email
        }
    });

    if (checkEmail) {
        if (bcrypt.compareSync(mat_khau, checkEmail.mat_khau)) {
            // ? gán key xác thực giữa refresh token và token
            let key = new Date().getTime()

            // ? tạo access token
            let token = createToken({ userId: checkEmail.dataValues.nguoi_dung_id, key });
            
            // ? tạo refresh token
            console.log(checkEmail)
            let refreshToken = createRefreshToken({ userId: checkEmail.dataValues.nguoi_dung_id, key })
            
            // ? lưu refresh token vào database
            checkEmail.refresh_token = refreshToken
            await model.nguoi_dung.update(checkEmail.dataValues, {
                where: {
                    nguoi_dung_id: checkEmail.dataValues.nguoi_dung_id
                }
            })

            responseData(200, "Thành công", "Đăng nhập thành công", token, res);
        } else {
            responseData(403, "Thất bại", "Mật khẩu không đúng!", "", res);
        }
    } else {
        responseData(403, "Thất bại", "Email không đúng!", "", res);
    }
}

const resetToken = async (req, res) => {

    // verify token
    let { token } = req.headers;

    let checkToken = verifyToken(token)
    if (checkToken != null && checkToken.name != "TokenExpiredError") { // loại trừ lỗi expired
        res.status(401).send("Unauthorized token")
        return
    }

    // lấy user trong database để get refresh token kiểm tra
    let getUser = await model.nguoi_dung.findByPk(decodeToken(token).data.userId);

    let checkRefreshToken = verifyRefreshToken(getUser.refresh_token)

    if (checkRefreshToken != null) {
        res.status(401).send("Unauthorized refresh token")
        return
    }

    //  check key
    if (decodeToken(token).data.key != decodeToken(getUser.refresh_token).data.key) {
        res.status(401).send("Unauthorized refresh token")
        return
    }

    // create access token
    let newToken = createToken({ userId: decodeToken(token).data.userId, key: decodeToken(getUser.refresh_token).data.key })
    responseData(201, "Thành công", "Làm mới access token thành công", newToken, res);
}

export { signUp, login, resetToken }