//* helper function to format success response

const successResponse = (res, statusCode = 200, data) =>{
    return res
            .status(statusCode)
            .json({status: statusCode, success: true, data})
};

//* helper function to format Error response

const errorResponse = (res, statusCode, message, data) =>{
    console.log(message, data)

    return res
            .status(statusCode)
            .json({status: statusCode, success: false, error: message, data })
};


module.exports ={
    successResponse, 
    errorResponse
}