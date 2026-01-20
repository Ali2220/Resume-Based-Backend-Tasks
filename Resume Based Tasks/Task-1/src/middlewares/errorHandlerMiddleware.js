const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message

    if(err.name === 'JsonWebTokenError'){
        statusCode = 401
        message = 'Invalid Token'
    }

    if(err.message === 'File is required'){
        statusCode = 422
        message = 'No file uploaded. Please Provide a file'
    }

    if(err.message === 'File type not allowed'){
        statusCode = 422
        message = err.message
    }

    if(err.code === 'LIMIT_FILE_SIZE'){
        statusCode = 422
        message = 'File too large. Max size 5MB'
    }

    if(err.statusCode){
        statusCode = err.statusCode
    }

    res.status(statusCode).json({
        success: false,
        message
    })

}

module.exports = errorHandler