// chuẩn hóa response 

export const responseData = (statusCode, statusText, message, content, response) => {
    response.status(statusCode).json({
        statusCode,
        statusText,
        message,
        content,
        date: new Date()
    })
}