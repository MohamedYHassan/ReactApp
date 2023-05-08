const connection = require("../db/dbConnection");
const util = require("util");

const admin = async (req, res,next) => {
    const query = util.promisify(connection.query).bind(connection);
    const { token } = req.headers; 
    const adminData = await query("select * from users where token = ?", [token]);
    if (adminData[0] && adminData[0].role == "1") { 
        next();
    } else {
        res.status(403).json({
            msg: "you are not authorized to access this route "
        })
    }
    

}


module.exports = admin; 