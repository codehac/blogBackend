const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')

let isAuthenticated = (req, res, next) => {
if(req.params.authToken || req.query.authToken || req.header('authToken')=="Admin"){
    if(req.params.authToken=='Admin' || req.query.authToken=='Admin' || req.header('Admin')){
        req.user= {fullName:'Admin', userId: 'Admin'}
        next();
    }
    else{
        logger.error('Incorrect Authentication token' , 'Authentication Middleware' , 5)
        let apiresponse =response.generate(true, 'Incorrect authenticationToken' ,403,null)
        resizeBy.send(apiresponse)
    }
} else{
    logger.error('Authentication token is Missing','Authntication MiddleWare',5)
    let apiResponse = response.generate(true, 'Authentication Token Is Missing In Request', 403, null)
    res.send(apiResponse)
}
}

module.exports = {
    isAuthenticated: isAuthenticated
}