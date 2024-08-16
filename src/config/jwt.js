import jwt from 'jsonwebtoken'

export const createToken = (data) => {
    // tham số 1 payload: string, buffer, object
    // tham số 2 signalture (secret key)
    // tham số 3 header
    return jwt.sign({ data: data }, "NODE_43", { algorithm: "HS256", expiresIn: "5m" })
}
export const createRefreshToken = (data) => {
    return jwt.sign({ data: data }, "REFRESH_NODE_43", { algorithm: "HS256", expiresIn: "7d" })
}

export const verifyToken = (token) => {
    // thuật toán kiểm tra token bằng khoá bí mật 
    // hợp lệ error = null, ko hợp lệ error != null
    return jwt.verify(token, "NODE_43", (error) => { return error })
}
export const verifyRefreshToken = token => jwt.verify(token, "REFRESH_NODE_43", error => error)

export const decodeToken = (token) => {
    return jwt.decode(token)
}

export const middlewareTokenHandler = (req, res, next) => {
    let { token } = req.headers;

    let checkToken = verifyToken(token)
    if (checkToken == null) {
        next()
    } else {
        console.log(checkToken)
        res.status(401).send("Unauthorized")
    }
}