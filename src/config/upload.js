import multer, { diskStorage } from 'multer'
// ? process.cwd(): trả về đường dẫn gốc của project
export const upload = multer({

    storage: diskStorage({
        destination: process.cwd() + "/public/imgs", // định nghĩa thư mục lưu file,
        filename: (req, file, callback) => { // đổi tên file

            let newName = new Date().getTime() + "_" + file.originalname;

            callback(null, newName)
        }
    })
})