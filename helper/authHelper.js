const bcrypt = require("bcrypt")

const hashPassword = async (password) =>{
    try{
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword;
    }
    catch(err) {
        console.log("error during hashing password..".bgRed.white)
    }
}

const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

module.exports = {hashPassword, comparePassword};