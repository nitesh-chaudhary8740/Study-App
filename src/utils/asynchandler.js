const asyncHandler = (func) => async (req,res,next) => {
        try {
           await func(req,res,next)
        } catch (error) {
            console.log("error in executing asyncHandler param function")
            res.status(error.code || 500).json({
                success:false,
                // message:error.message || "An unexpected error occurred" //this might reveal senstive information
                message: error.msg|| "An unexpected error occurred",
                errors:error.errors
            })
        }
}
export {asyncHandler}