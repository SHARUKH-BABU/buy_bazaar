const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel")

const requireSignIn = async (req, res, next) => {
    try{
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode             /////        this is used in isAdmin middleware
        next()
    }
    catch(err){
        return res.status(400).json({message: "Invalid token, please login again"})
    }
}

const isAdmin = async (req, res, next) => {
    try {
        console.log("req.user : ", req.user);
        const user = await userModel.findById(req.user._id);
        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "Admin access denied"
            });
        }else{
            next();
        }
    } catch (err) {
        console.log("error : " , err.message.bgRed);
        return res.status(400).json({
            success: false,
            message: "Error in admin middleware",
            error: err  // Include the actual error for debugging
        });
    }
}


module.exports = {requireSignIn, isAdmin}