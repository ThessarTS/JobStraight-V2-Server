const errorHandler = (err, req, res, next) => {
    let code = 500
    let message = 'Internal Server Error'

    if (err.name == 'invalidInput') {
        code = 400
        message = err.msg
    }

    res.status(code).json({ message })
}

module.exports = errorHandler