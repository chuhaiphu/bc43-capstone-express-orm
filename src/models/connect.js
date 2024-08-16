// ! chuỗi kết nối
import { Sequelize } from 'sequelize'
import config from '../config/database.js'

const sequelize = new Sequelize(config.database, config.user, config.pass, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
})


export default sequelize;