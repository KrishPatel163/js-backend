class ApiError extends Error {
    constructor(statusCode, message="Somethign Went Wrong", errors=[], stack){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        if (stack) {
            this.stack = stack
        }else{
            this.stack = Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { ApiError }