import express from 'express'
import rootRouter from './routes/rootRouter.js';
import cors from 'cors'

const app = express();

// khai báo middleware
app.use(express.json())

// định vị load thư mục tài nguyên
app.use(express.static(".")) 

//  cho phép tất cả domain truy cập
app.use(cors()) 

// hàm khởi tạo server với port tự định nghĩa
app.use(rootRouter)

// localhost:8080
app.listen(8080)

// cách mới: node v20.11 trở lên => node --watch  server.js
// cách cũ: node v20 trở xuống => yarn add nodemon
