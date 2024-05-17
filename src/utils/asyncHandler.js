const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        const statusCode = (Number.isInteger(error.code) && error.code >= 100 && error.code <= 599) ? error.code : 500;
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
};


export { asyncHandler }